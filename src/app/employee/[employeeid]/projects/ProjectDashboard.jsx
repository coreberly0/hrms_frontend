"use client";

import { useEffect, useState } from "react";
import {
  getProjectsByEmployee,
  getAllProjects,
  deleteProject,
} from "@/services/projectService";
import { getEmployeeById } from "@/services/employee";

import AddProject from "./AddProject";
import EditProject from "./EditProject";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProjectDashboard({ employeeid }) {
  const [projects, setProjects] = useState([]);
  const [role, setRole] = useState("");
  const [edit, setEdit] = useState(null);
  const [add, setAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const emp = await getEmployeeById(employeeid);
      const empRole = emp.role.toLowerCase();
      setRole(empRole);

      const data =
        empRole === "manager"
          ? await getAllProjects()
          : await getProjectsByEmployee(employeeid);

      // Normalize employees (IMPORTANT FIX)
      const normalized = (data || []).map((p) => ({
        ...p,
        employees: Array.isArray(p.employees) ? p.employees : [],
      }));

      setProjects(normalized);
    } catch (err) {
      console.error("Dashboard load error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [employeeid]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading projects...</p>;
  }

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        {role === "manager" && (
          <Button onClick={() => setAdd(true)}>➕ Add Project</Button>
        )}
      </div>

      {/* PROJECT LIST */}
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.project_name}</CardTitle>

                <Badge
                  variant={
                    p.status === "Completed"
                      ? "default"
                      : p.status === "Ongoing"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {p.status || "Not Started"}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {p.description || "No description"}
                </p>

                <p className="text-sm">
                  <strong>Progress:</strong> {p.progress || 0}%
                </p>

                {/* ✅ Avatar Group (FIXED) */}
                {p.employees.length > 0 && (
                  <div className="flex items-center -space-x-2">
                    {p.employees.map((emp) => (
                      <Avatar
                        key={emp.id}
                        className="w-8 h-8 border-2 border-white"
                      >
                        <AvatarFallback>
                          {emp.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                )}

                {/* Manager Actions */}
                {role === "manager" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={() => setEdit(p)}>
                      ✏️ Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        await deleteProject(p.id);
                        load();
                      }}
                    >
                      🗑 Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {add && (
        <AddProject
          onClose={() => setAdd(false)}
          onSuccess={() => {
            setAdd(false);
            load();
          }}
        />
      )}

      {/* EDIT MODAL */}
      {edit && (
        <EditProject
          project={edit}
          onClose={() => setEdit(null)}
          onSuccess={() => {
            setEdit(null);
            load();
          }}
        />
      )}
    </div>
  );
}