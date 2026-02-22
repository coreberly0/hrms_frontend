"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Clock,
  LogIn,
  LogOut,
  User,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { getEmployeeById } from "@/services/employee";

export default function EmployeeDashboard({ employeeid }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ================= CURRENT TIME ================= */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ================= FETCH EMPLOYEE ================= */
  useEffect(() => {
    if (!employeeid || !token) return;

    async function fetchEmployee() {
      try {
        const data = await getEmployeeById(employeeid, token);
        setEmployee(data);
        loadTodayAttendance();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [employeeid, token]);

  /* ================= ATTENDANCE ================= */

  const getTodayKey = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const loadTodayAttendance = () => {
    const key = `attendance:${employeeid}:${getTodayKey()}`;
    const stored = localStorage.getItem(key);
    if (!stored) return;

    const data = JSON.parse(stored);
    setClockInTime(data.clockInTime ? new Date(data.clockInTime) : null);
    setClockOutTime(data.clockOutTime ? new Date(data.clockOutTime) : null);
    setTodayStatus(data.status);
  };

  const handleClockIn = () => {
    const now = new Date();
    const key = `attendance:${employeeid}:${getTodayKey()}`;

    localStorage.setItem(
      key,
      JSON.stringify({
        clockInTime: now.toISOString(),
        clockOutTime: null,
        status: null,
      })
    );

    setClockInTime(now);
    setClockOutTime(null);
    setTodayStatus(null);
  };

  const handleClockOut = () => {
    if (!clockInTime) return;

    const now = new Date();
    const hours = (now - clockInTime) / (1000 * 60 * 60);
    const status = hours >= 8 ? "Present" : "Absent";

    const key = `attendance:${employeeid}:${getTodayKey()}`;

    localStorage.setItem(
      key,
      JSON.stringify({
        clockInTime: clockInTime.toISOString(),
        clockOutTime: now.toISOString(),
        status,
      })
    );

    setClockOutTime(now);
    setTodayStatus(status);
  };

  const formatTime = (date) =>
    date
      ? date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "--:--:--";

  const calculateWorkedTime = () => {
    if (!clockInTime) return "00:00:00";
    const end = clockOutTime || currentTime;
    const diff = end - clockInTime;

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-60 text-gray-500">
        Loading employee dashboard...
      </div>
    );

  if (!employee)
    return (
      <div className="text-center text-red-500 mt-10">
        Employee not found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{employee.name}</h1>
          <p className="opacity-80">
            {employee.position} · {employee.department}
          </p>
        </div>

        <span
          className={`px-4 py-1 rounded-full text-sm ${
            todayStatus === "Present"
              ? "bg-green-100 text-green-800"
              : todayStatus === "Absent"
              ? "bg-red-100 text-red-800"
              : "bg-white/20"
          }`}
        >
          {todayStatus || employee.status}
        </span>
      </div>

      {/* ================= ATTENDANCE ================= */}
      <Card title="Today's Attendance">
        <div className="space-y-4">

          <div className="text-center">
            <Clock className="mx-auto h-6 w-6 text-indigo-600" />
            <p className="text-2xl font-bold text-indigo-900">
              {formatTime(currentTime)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <AttendanceBox
              title="Clock In"
              icon={<LogIn />}
              time={formatTime(clockInTime)}
              color="green"
            />
            <AttendanceBox
              title="Clock Out"
              icon={<LogOut />}
              time={formatTime(clockOutTime)}
              color="red"
            />
          </div>

          {clockInTime && (
            <div className="text-center bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-600">Worked Time</p>
              <p className="text-xl font-bold text-purple-800">
                {calculateWorkedTime()}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClockIn}
              disabled={clockInTime && !clockOutTime}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300"
            >
              Clock In
            </button>

            <button
              onClick={handleClockOut}
              disabled={!clockInTime || clockOutTime}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-300"
            >
              Clock Out
            </button>
          </div>
        </div>
      </Card>

      {/* ================= INFO SECTION ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Personal Information">
          <Info label="Email" value={employee.email} />
          <Info label="Phone" value={employee.personal_phone} />
          <Info label="Gender" value={employee.gender} />
          <Info label="Address"
            value={`${employee.door_no}, ${employee.street}, ${employee.city}`}
          />
        </Card>

        <Card title="Company Information">
          <Info label="Role" value={employee.role} />
          <Info label="Department" value={employee.department} />
          <Info
            label="Salary"
            value={
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                ₹ {employee.salary}
              </span>
            }
          />
          <Info label="Joining Date" value={employee.joining_date} />
        </Card>
      </div>

      {/* ================= LEAVE ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Apply Leave">
          <Link
            href={`/employee/${employeeid}/leave`}
            className="block text-center bg-slate-900 text-white py-2 rounded-lg"
          >
            Apply Leave
          </Link>
        </Card>

        <Card title="Attendance History">
          <Link
            href={`/employee/${employeeid}/attendance`}
            className="block text-center border py-2 rounded-lg"
          >
            View Attendance
          </Link>
        </Card>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}

function AttendanceBox({ title, icon, time, color }) {
  return (
    <div
      className={`p-3 rounded-lg border ${
        color === "green"
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="text-xl font-bold">{time}</p>
    </div>
  );
}