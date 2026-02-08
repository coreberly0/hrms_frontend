"use client";

import { useEffect, useState } from "react";

export default function EmployeeDashboard({ employeeid }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [employeeid]);

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

      {/* 📅 ATTENDANCE */}
      <Card title="Attendance History">
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
