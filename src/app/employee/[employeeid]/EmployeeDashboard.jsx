"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Clock,
  LogIn,
  LogOut,
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
  const [token, setToken] = useState(null);

  /* ================= TOKEN ================= */
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

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
        loadTodayAttendance(employeeid);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [employeeid, token]);

  /* ================= ATTENDANCE ================= */

  const getTodayKey = () =>
    new Date().toISOString().split("T")[0];

  const loadTodayAttendance = (empId) => {
    const key = `attendance:${empId}:${getTodayKey()}`;
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

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "-";

  const calculateWorkedTime = () => {
    if (!clockInTime) return "00:00:00";
    const end = clockOutTime || currentTime;
    const diff = end - clockInTime;

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  if (loading)
    return <div className="text-center p-10">Loading dashboard...</div>;

  if (!employee)
    return <div className="text-center text-red-500">Employee not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">{employee.name}</h1>
          <p className="opacity-80">
            {employee.position} · {employee.department}
          </p>
        </div>
        <span className="px-4 py-2 rounded-full h-10 bg-white/22">
          {todayStatus || employee.status}
        </span>
      </div>

      {/* ATTENDANCE */}
      <SectionCard title="Today's Attendance">
        <div className="text-center mb-4">
          <Clock className="mx-auto text-indigo-600" />
          <p className="text-2xl font-bold">{formatTime(currentTime)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <AttendanceBox title="Clock In" icon={<LogIn />} time={formatTime(clockInTime)} color="green" />
          <AttendanceBox title="Clock Out" icon={<LogOut />} time={formatTime(clockOutTime)} color="red" />
        </div>

        {clockInTime && (
          <p className="text-center mt-4 font-bold">
            Worked: {calculateWorkedTime()}
          </p>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleClockIn}
            disabled={clockInTime && !clockOutTime}
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            Clock In
          </button>
          <button
            onClick={handleClockOut}
            disabled={!clockInTime || clockOutTime}
            className="flex-1 bg-red-600 text-white py-2 rounded"
          >
            Clock Out
          </button>
        </div>
      </SectionCard>

      {/* INFO */}
      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard title="Personal Info">
          <Info label="Email" value={employee.email} />
          <Info label="Phone" value={employee.personal_phone} />
        </SectionCard>

        <SectionCard title="Company Info">
          <Info label="Role" value={employee.role} />
          <Info label="Salary" value={<> ₹{employee.salary}</>} />
          <Info label="Joining Date" value={formatDate(employee.joining_date)} />
        </SectionCard>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span>{value || "-"}</span>
    </div>
  );
}

function AttendanceBox({ title, icon, time, color }) {
  return (
    <div className={`p-3 rounded border ${color === "green" ? "bg-green-50" : "bg-red-50"}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-xl font-bold">{time}</p>
    </div>
  );
}