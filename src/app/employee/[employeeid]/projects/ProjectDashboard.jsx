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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { Plus, Pencil, Trash2, Wallet } from "lucide-react";

/* ✅ SMALL STEP STATUS COMPONENT */
function StatusSteps({ status }) {
  const steps = [
    { key: "Processing", color: "bg-yellow-400" },
    { key: "Ongoing", color: "bg-blue-500" },
    { key: "Completed", color: "bg-green-500" },
  ];

  const activeIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex gap-1 mt-2">
      {steps.map((step, index) => (
        <div
          key={step.key}
          className={`h-2.5 w-7 rounded-full transition-all duration-300 ${
            index <= activeIndex ? step.color : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

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
      const empRole = emp?.role?.toLowerCase() || "";
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [employeeid]);

  /* ✅ BEAUTIFUL LOADING */
  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-md" />
      </div>
    );
  }

  /* ✅ STATUS BADGE COLOR */
  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Ongoing":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

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
          <Button onClick={() => setAdd(true)}>
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
          <div className="col-span-2">Created</div>
          <div className="col-span-2">Team</div>
          {role === "manager" && (
            <div className="col-span-1 text-right">Actions</div>
          )}
        </div>
      )}

      {/* PROJECT ROWS */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No projects available
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-12 items-center bg-card border rounded-xl px-4 py-5 hover:shadow-lg transition"
            >
              {/* PROJECT */}
              <div className="col-span-3">
                <div className="font-semibold">
                  {p.project_name}
                </div>

                <div className="text-xs text-muted-foreground truncate">
                  {p.description || "No description"}
                </div>

                <StatusSteps status={p.status} />
              </div>

              {/* STATUS BADGE */}
              <div className="col-span-2">
                <Badge className={getStatusColor(p.status)}>
                  {p.status || "Not Started"}
                </Badge>
              </div>

              {/* BUDGET */}
              <div className="col-span-2 flex items-center gap-2 font-medium">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                ₹{Number(p.budget || 0).toLocaleString()}
              </div>

              {/* CREATED DATE */}
              <div className="col-span-2 text-sm text-muted-foreground">
                {p.created_at
                  ? new Date(p.created_at).toLocaleDateString()
                  : "—"}
              </div>

              {/* TEAM */}
              <div className="col-span-2 flex -space-x-2">
                {p.employees.slice(0, 4).map((emp) => (
                  <Avatar
                    key={emp.id}
                    className="h-9 w-9 border-2 border-background"
                  >
                    <AvatarFallback>
                      {emp.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}

                {p.employees.length > 4 && (
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-muted text-xs font-medium border-2 border-background">
                    +{p.employees.length - 4}
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              {role === "manager" && (
                <div className="col-span-1 flex justify-end gap-2">
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