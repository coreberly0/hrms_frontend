"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";

export default function Dummy({ employeeid }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!employeeid) {
      setLoading(false);
      return;
    }

    async function fetchLogs() {
      const res = await fetch(`/api/employees/${employeeid}`);
      const data = await res.json();
      setLogs(data);
      setLoading(false);
    }

    fetchLogs();
    loadTodayAttendance();
  }, [employeeid]);

  const getTodayDateKey = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  };

  const loadTodayAttendance = () => {
    if (!employeeid || typeof window === "undefined") return;

    const todayKey = getTodayDateKey();
    const attendanceKey = `attendance:${employeeid}:${todayKey}`;
    const stored = window.localStorage.getItem(attendanceKey);

    if (stored) {
      const data = JSON.parse(stored);
      setClockInTime(data.clockInTime ? new Date(data.clockInTime) : null);
      setClockOutTime(data.clockOutTime ? new Date(data.clockOutTime) : null);
      setTodayStatus(data.status);
    }
  };

  const handleClockIn = () => {
    if (!employeeid || typeof window === "undefined") return;

    const now = new Date();
    const todayKey = getTodayDateKey();
    const attendanceKey = `attendance:${employeeid}:${todayKey}`;

    const data = {
      clockInTime: now.toISOString(),
      clockOutTime: null,
      status: null,
      date: todayKey,
    };

    window.localStorage.setItem(attendanceKey, JSON.stringify(data));
    setClockInTime(now);
    setClockOutTime(null);
    setTodayStatus(null);
  };

  const handleClockOut = () => {
    if (!employeeid || !clockInTime || typeof window === "undefined") return;

    const now = new Date();
    const todayKey = getTodayDateKey();
    const attendanceKey = `attendance:${employeeid}:${todayKey}`;

    // Calculate hours worked
    const diffMs = now - clockInTime;
    const diffHrs = diffMs / (1000 * 60 * 60);
    const status = diffHrs >= 8 ? "Present" : "Absent";

    const data = {
      clockInTime: clockInTime.toISOString(),
      clockOutTime: now.toISOString(),
      hoursWorked: diffHrs.toFixed(2),
      status: status,
      date: todayKey,
    };

    window.localStorage.setItem(attendanceKey, JSON.stringify(data));
    setClockOutTime(now);
    setTodayStatus(status);

    // Update the attendance logs in the employee API storage
    updateAttendanceLogs(todayKey, clockInTime, now, status);
  };

  const updateAttendanceLogs = (dateKey, clockIn, clockOut, status) => {
    if (typeof window === "undefined") return;

    const logsKey = `employeeAttendanceLogs:${employeeid}`;
    const existingLogs = JSON.parse(window.localStorage.getItem(logsKey) || "[]");

    const logEntry = {
      date: dateKey,
      loginTime: clockIn.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      logoutTime: clockOut.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: status,
    };

    // Check if entry exists for today, update or add
    const existingIndex = existingLogs.findIndex((log) => log.date === dateKey);
    if (existingIndex >= 0) {
      existingLogs[existingIndex] = logEntry;
    } else {
      existingLogs.push(logEntry);
    }

    window.localStorage.setItem(logsKey, JSON.stringify(existingLogs));
  };

  const formatTime = (date) => {
    if (!date) return "--:--:--";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const calculateElapsedTime = () => {
    if (!clockInTime) return "00:00:00";
    const now = clockOutTime || currentTime;
    const diffMs = now - clockInTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-500">
        Loading employee dashboard...
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="text-center text-red-500 mt-10">
        No employee data found
      </div>
    );
  }

  const emp = logs[0];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{emp.employeeName}</h1>
          <p className="opacity-80">{emp.designation} · {emp.department}</p>
        </div>
        <span className="px-4 py-1 rounded-full bg-white/20 text-sm">
          {emp.status}
        </span>
      </div>

      {/* ⏰ CLOCK IN/OUT SECTION */}
      <Card title="Today's Attendance">
        <div className="space-y-3">
          {/* Time Display */}
          <div className="flex items-center justify-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <Clock className="h-6 w-6 text-indigo-600" />
            <div className="text-center">
              <p className="text-xs text-gray-600">Current Time</p>
              <p className="text-2xl font-bold text-indigo-900">
                {formatTime(currentTime)}
              </p>
            </div>
          </div>

          {/* Clock In/Out Status */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <LogIn className="h-4 w-4 text-green-600" />
                <p className="text-xs font-medium text-green-900">Clock In</p>
              </div>
              <p className="text-xl font-bold text-green-700">
                {clockInTime ? formatTime(clockInTime) : "--:--:--"}
              </p>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <LogOut className="h-4 w-4 text-red-600" />
                <p className="text-xs font-medium text-red-900">Clock Out</p>
              </div>
              <p className="text-xl font-bold text-red-700">
                {clockOutTime ? formatTime(clockOutTime) : "--:--:--"}
              </p>
            </div>
          </div>

          {/* Elapsed Time */}
          {clockInTime && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <p className="text-xs text-purple-900 mb-1">Time Worked Today</p>
              <p className="text-2xl font-bold text-purple-700">
                {calculateElapsedTime()}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {parseFloat(calculateElapsedTime().split(":")[0]) >= 8
                  ? "✓ Minimum 8 hours completed"
                  : "⚠ Need 8 hours for Present status"}
              </p>
            </div>
          )}

          {/* Status Badge */}
          {todayStatus && (
            <div className="text-center">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${
                  todayStatus === "Present"
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-red-100 text-red-700 border-2 border-red-300"
                }`}
              >
                Today's Status: {todayStatus}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleClockIn}
              disabled={clockInTime && !clockOutTime}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                clockInTime && !clockOutTime
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <LogIn className="h-4 w-4" />
              Clock In
            </button>

            <button
              onClick={handleClockOut}
              disabled={!clockInTime || clockOutTime}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                !clockInTime || clockOutTime
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              <LogOut className="h-4 w-4" />
              Clock Out
            </button>
          </div>
        </div>
      </Card>

      {/* 👤 PERSONAL INFO */}
      <div className="grid md:grid-cols-2 gap-6">

        <Card title="Personal Information">
          <Info label="Employee Code" value={emp.employeeCode} />
          <Info label="Gender" value={emp.gender} />
          <Info label="Marital Status" value={emp.maritalStatus} />
          <Info label="Email" value={emp.email} />
          <Info label="Phone" value={emp.personalPhone} />
          <Info label="Alternate Phone" value={emp.alternatePhone} />
        </Card>

        <Card title="Company Information">
          <Info label="Company" value={emp.companyName} />
          <Info label="Role" value={emp.role} />
          <Info label="Department" value={emp.department} />
          <Info label="Salary" value={`₹ ${emp.salary}`} />
          <Info label="Joining Date" value={emp.joiningDate} />
        </Card>

      </div>

      {/* 🏠 ADDRESS */}
      <Card title="Address">
        <p className="text-gray-700">
          {emp.address.doorNo}, {emp.address.street}, {emp.address.area},
          <br />
          {emp.address.city}, {emp.address.state} – {emp.address.pincode}
        </p>
      </Card>

      {/*📅 ATTENDANCE */}
      <Card title="Attendance History">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            View full attendance details
          </p>
          <Link
            href={`/employee/${employeeid}/attendance`}
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Open attendance
          </Link>
        </div>
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border"
            >
              <span>{log.date}</span>
              <span className="text-sm text-gray-600">
                {log.loginTime ?? "-"} → {log.logoutTime ?? "-"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  log.status === "Present"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 🏖️ LEAVE MANAGEMENT */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Apply Leave">
          <p className="text-sm text-gray-500 mb-4">
            Submit a new leave request for approval
          </p>
          <Link
            href={`/employee/${employeeid}/attendance`}
            className="inline-block w-full text-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Apply for Leave
          </Link>
        </Card>

        <Card title="My Leaves">
          <p className="text-sm text-gray-500 mb-4">
            View your leave balance and application status
          </p>
          <Link
            href={`/employee/${employeeid}/attendance`}
            className="inline-block w-full text-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View Leave History
          </Link>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- SMALL UI COMPONENTS ---------------- */

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
      <span className="font-medium">{value}</span>
    </div>
  );
}