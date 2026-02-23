"use client";

import { useEffect, useState } from "react";
import {
  assignEmployeeToProject,
  removeEmployeeFromProject,
} from "@/services/projectService";
import { getEmployees } from "@/services/employee";

export default function AssignEmployee({
  project,
  token,
  onClose,
  onSuccess,
}) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees(token).then(setEmployees);
  }, []);

  const assignedIds =
    project.assigned_employees?.map((e) => e.employee_id) || [];

  const handleAssign = async (empId) => {
    if (assignedIds.includes(empId)) {
      alert("Already assigned");
      return;
    }

    await assignEmployeeToProject(
      {
        project_id: project.id,
        employee_id: empId,
        role_in_project: "Developer",
      },
      token
    );

    onSuccess();
  };

  const handleRemove = async (empId) => {
    await removeEmployeeFromProject(project.id, empId, token);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 w-[400px] rounded">
        <h2 className="font-bold mb-4">
          Assign Employees – {project.project_name}
        </h2>

        {employees.map((emp) => (
          <div
            key={emp.id}
            className="flex justify-between items-center mb-2"
          >
            <span>{emp.name}</span>

            {assignedIds.includes(emp.id) ? (
              <button
                className="text-red-500"
                onClick={() => handleRemove(emp.id)}
              >
                Remove
              </button>
            ) : (
              <button
                className="text-green-600"
                onClick={() => handleAssign(emp.id)}
              >
                Assign
              </button>
            )}
          </div>
        ))}

        <button className="mt-4" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}