'use client';

import { useEffect, useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { getEmployeeById } from "@/services/employee"; // your API call

export default function EmployeeDashboard({ employeeid }) {
  const [employee, setEmployee] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch employee from API
  useEffect(() => {
    if (!employeeid || !token) return;

    async function fetchEmployee() {
      try {
        const empData = await getEmployeeById(employeeid, token);
        setEmployee(empData);

        // Load attendance from localStorage
        const todayKey = new Date().toISOString().split("T")[0];
        const attendanceKey = `attendance:${employeeid}:${todayKey}`;
        const stored = window.localStorage.getItem(attendanceKey);
        if (stored) {
          const data = JSON.parse(stored);
          setClockInTime(data.clockInTime ? new Date(data.clockInTime) : null);
          setClockOutTime(data.clockOutTime ? new Date(data.clockOutTime) : null);
          setTodayStatus(data.status);
        }
      } catch (err) {
        console.error("Failed to fetch employee:", err);
      }
    }

    fetchEmployee();
  }, [employeeid, token]);

  // Clock In
  const handleClockIn = () => {
    const now = new Date();
    const todayKey = new Date().toISOString().split("T")[0];
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

  // Clock Out
  const handleClockOut = () => {
    if (!clockInTime) return;
    const now = new Date();
    const diffHrs = (now - clockInTime) / (1000 * 60 * 60);
    const status = diffHrs >= 8 ? "Present" : "Absent";

    const todayKey = new Date().toISOString().split("T")[0];
    const attendanceKey = `attendance:${employeeid}:${todayKey}`;
    const data = {
      clockInTime: clockInTime.toISOString(),
      clockOutTime: now.toISOString(),
      hoursWorked: diffHrs.toFixed(2),
      status,
      date: todayKey,
    };
    window.localStorage.setItem(attendanceKey, JSON.stringify(data));
    setClockOutTime(now);
    setTodayStatus(status);
  };

  const formatTime = (date) => (date ? date.toLocaleTimeString() : "--:--:--");

  if (!employee) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{employee.name}</h1>
          <p className="opacity-80">{employee.position} · {employee.department}</p>
        </div>
        <span className="px-4 py-1 rounded-full bg-white/20 text-sm">
          {todayStatus || employee.status || "N/A"}
        </span>
      </div>

      {/* CLOCK IN/OUT */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <LogIn className="mx-auto h-6 w-6 text-green-600" />
          <p className="font-bold text-green-700 text-xl">{formatTime(clockInTime)}</p>
          <button
            onClick={handleClockIn}
            disabled={clockInTime && !clockOutTime}
            className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
          >
            Clock In
          </button>
        </div>

        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
          <LogOut className="mx-auto h-6 w-6 text-red-600" />
          <p className="font-bold text-red-700 text-xl">{formatTime(clockOutTime)}</p>
          <button
            onClick={handleClockOut}
            disabled={!clockInTime || clockOutTime}
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300"
          >
            Clock Out
          </button>
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-2">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p>Name: {employee.name}</p>
          <p>Email: {employee.email}</p>
          <p>Gender: {employee.gender || "-"}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-2">
          <h2 className="text-xl font-semibold">Company Information</h2>
          <p>Role: {employee.role}</p>
          <p>Position: {employee.position}</p>
          <p>Department: {employee.department}</p>
          <p>Salary: ₹ {employee.salary}</p>
        </div>
      </div>
    </div>
  );
}