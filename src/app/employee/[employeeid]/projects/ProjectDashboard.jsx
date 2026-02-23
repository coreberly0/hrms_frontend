"use client";

import { useEffect, useState } from "react";
import {
  getProjectsByEmployee,
  assignEmployeeToProject,
  removeEmployeeFromProject,
} from "@/services/projectService";
import { getEmployees, getEmployeeById } from "@/services/employee";
import AddProject from "./AddProject";

export default function ProjectDashboard({ employeeid }) {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const isManager = role?.toLowerCase() === "manager";

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);

      const emp = await getEmployeeById(employeeid);
      setRole(emp?.role || "");

      const proj = await getProjectsByEmployee(employeeid);

      // 🔥 NORMALIZE HERE (IMPORTANT)
      const normalized = Array.isArray(proj)
        ? proj.map((p) => ({
            ...p,
            assigned_employees: Array.isArray(p.assigned_employees)
              ? p.assigned_employees
              : [],
          }))
        : [];

      setProjects(normalized);

      if (emp?.role?.toLowerCase() === "manager") {
        const empList = await getEmployees();
        setEmployees(Array.isArray(empList) ? empList : []);
      }
    } catch (err) {
      console.error("Load error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeid) loadData();
  }, [employeeid]);

  /* ================= ASSIGN ================= */
  const handleAssign = async (projectId, employeeId) => {
    if (!employeeId) return;

    await assignEmployeeToProject({
      project_id: projectId,
      employee_id: Number(employeeId),
      role_in_project: "Developer",
    });

    await loadData(); // force refresh
  };

  /* ================= REMOVE ================= */
  const handleRemove = async (projectId, empId) => {
    await removeEmployeeFromProject(projectId, empId);
    await loadData();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* ADD PROJECT */}
      {isManager && (
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Project
        </button>
      )}

      {/* ADD PROJECT MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <AddProject
              onSuccess={() => {
                setShowAdd(false);
                loadData();
              }}
            />
            <button
              onClick={() => setShowAdd(false)}
              className="mt-3 text-red-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* PROJECT LIST */}
      {projects.map((project) => {
        const assigned = project.assigned_employees;

        return (
          <div
            key={project.id}
            className="border p-4 rounded shadow space-y-3"
          >
            {/* HEADER */}
            <div className="flex justify-between">
              <h2 className="font-bold text-lg">
                {project.project_name}
              </h2>
              <span className="text-gray-600">
                💰 {project.budget}
              </span>
            </div>

            {/* COUNT */}
            <div className="text-sm text-gray-600">
              👥 Assigned Employees: {assigned.length}
            </div>

            {/* AVATARS */}
            <div className="flex gap-2 flex-wrap">
              {assigned.length > 0 ? (
                assigned.map((emp) => (
                  <div
                    key={emp.employee_id}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">
                      {emp.employee_name.charAt(0)}
                    </div>

                    <span className="text-sm">
                      {emp.employee_name}
                    </span>

                    {isManager && (
                      <button
                        className="text-red-500 ml-1"
                        onClick={() =>
                          handleRemove(project.id, emp.employee_id)
                        }
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-gray-500 italic">
                  👤 No employees assigned
                </span>
              )}
            </div>

            {/* ASSIGN */}
            {isManager && (
              <select
                className="border p-2 mt-2"
                onChange={(e) =>
                  handleAssign(project.id, e.target.value)
                }
              >
                <option value="">Assign employee</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </div>
  );
}