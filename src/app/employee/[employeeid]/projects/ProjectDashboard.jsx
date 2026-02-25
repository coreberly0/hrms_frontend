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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

import {
  Plus,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react";

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

      setProjects(
        (data || []).map((p) => ({
          ...p,
          employees: Array.isArray(p.employees) ? p.employees : [],
        }))
      );
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [employeeid]);

  /* ✅ CENTER SPINNER */
  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Project Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Overview of all company projects
          </p>
        </div>

        {role === "manager" && (
          <Button
            size="default"
            className="shadow-sm"
            onClick={() => setAdd(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      <Separator />

      {/* TABLE HEADER */}
      {projects.length > 0 && (
        <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground px-4">
          <div className="col-span-3">Project</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Budget</div>
          <div className="col-span-3">Team</div>
          {role === "manager" && (
            <div className="col-span-2 text-right">Actions</div>
          )}
        </div>
      )}

      {/* PROJECT ROWS */}
      <div className="space-y-2">
        {projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No projects available
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-12 items-center bg-card border rounded-xl px-4 py-4 hover:shadow-md transition"
            >
              {/* PROJECT NAME */}
              <div className="col-span-3">
                <div className="font-semibold">
                  {p.project_name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {p.description || "No description"}
                </div>
              </div>

              {/* STATUS */}
              <div className="col-span-2">
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
              </div>

              {/* BUDGET */}
              <div className="col-span-2 flex items-center gap-2 font-medium">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                ₹{Number(p.budget || 0).toLocaleString()}
              </div>

              {/* EMPLOYEE AVATARS */}
              <div className="col-span-3 flex -space-x-2">
                {p.employees.map((emp) => (
                  <Avatar
                    key={emp.id}
                    className="h-9 w-9 border-2 border-background"
                  >
                    <AvatarFallback>
                      {emp.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>

              {/* ACTIONS */}
              {role === "manager" && (
                <div className="col-span-2 flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setEdit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={async () => {
                      await deleteProject(p.id);
                      load();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

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