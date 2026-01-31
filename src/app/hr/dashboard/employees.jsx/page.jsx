"use client";

import React, { useEffect, useState } from "react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call the API
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employee"); // ✅ absolute path
        if (!res.ok) throw new Error("Failed to fetch employees");

        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Employees List</h2>
      {employees.length === 0 ? (
        <p>No employees found</p>
      ) : (
        <ul className="space-y-1">
          {employees.map(emp => (
            <li key={emp.id} className="border p-2 rounded">
              <p><strong>Name:</strong> {emp.name}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Department:</strong> {emp.department}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
