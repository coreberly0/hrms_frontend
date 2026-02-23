"use client";

import { useEffect, useState } from "react";
import {
  getProjectsByEmployee,
  assignEmployeeToProject,
  removeEmployeeFromProject,
} from "@/services/projectService";
import { getEmployees, getEmployeeById } from "@/services/employee";
import AddProject from "./AddProject";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      console.error(err.message);
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

    loadData();
  };

  /* ================= REMOVE ================= */
  const handleRemove = async (projectId, empId) => {
    await removeEmployeeFromProject(projectId, empId);
    loadData();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>

        {isManager && (
          <Button onClick={() => setShowAdd(true)}>
            ➕ Add Project
          </Button>
        )}
      </div>

      {/* ADD PROJECT MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <AddProject
              onSuccess={() => {
                setShowAdd(false);
                loadData();
              }}
            />
            <Button
              variant="destructive"
              className="mt-4 w-full"
              onClick={() => setShowAdd(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* PROJECT GRID (3 PER ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const assigned = project.assigned_employees;

          return (
            <Card key={project.id} className="hover:shadow-lg transition">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg">
                  {project.project_name}
                </CardTitle>

                {isManager && (
                  <Badge variant="secondary" className="w-fit">
                    💰 ₹{Number(project.budget || 0).toLocaleString()}
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* EMPLOYEE COUNT */}
                <div className="text-sm text-muted-foreground">
                  👥 {assigned.length} Employees Assigned
                </div>

                {/* AVATARS */}
                <div className="flex flex-wrap gap-2">
                  {assigned.length > 0 ? (
                    assigned.map((emp) => (
                      <div
                        key={emp.employee_id}
                        className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
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
                    <span className="text-sm text-muted-foreground italic">
                      No employees assigned
                    </span>
                  )}
                </div>

                {/* ASSIGN */}
                {isManager && (
                  <select
                    className="border rounded-md p-2 w-full"
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}