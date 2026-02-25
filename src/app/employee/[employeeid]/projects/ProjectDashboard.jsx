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
import { ScrollArea } from "@/components/ui/scroll-area";

import { Plus, Pencil, Trash2, Wallet } from "lucide-react";

/* ---------------- STATUS STEPS ---------------- */
function StatusSteps({ status }) {
  const s = status?.toLowerCase();

  const steps = [
    { key: "not started", color: "bg-yellow-400" },
    { key: "ongoing", color: "bg-blue-500" },
    { key: "completed", color: "bg-green-500" },
  ];

  let activeIndex = steps.findIndex((x) => s?.includes(x.key));
  if (activeIndex === -1) activeIndex = 0;

  return (
    <div className="flex gap-1 mt-2">
      {steps.map((step, i) => (
        <div
          key={step.key}
          className={`h-2.5 w-7 rounded-full ${
            i <= activeIndex ? step.color : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
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
      setRole(emp.role.toLowerCase());

      const data =
        emp.role.toLowerCase() === "manager"
          ? await getAllProjects()
          : await getProjectsByEmployee(employeeid);

      setProjects(
        (data || []).map((p) => ({
          ...p,
          employees: Array.isArray(p.employees) ? p.employees : [],
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [employeeid]);

  /* --------- LOADING --------- */
  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col p-6 gap-4">
      {/* HEADER */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all company projects
          </p>
        </div>

        {role === "manager" && (
          <Button onClick={() => setAdd(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        )}
      </div>

      <Separator />

      {/* TABLE HEADER */}
      {projects.length > 0 && (
        <div className="grid grid-cols-14 text-sm font-medium text-muted-foreground px-4 shrink-0">
          <div className="col-span-1">S.No</div>
          <div className="col-span-2">Project ID</div>
          <div className="col-span-3">Project</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Budget</div>
          <div className="col-span-2">Progress</div>
          <div className="col-span-1">Team</div>
          {role === "manager" && (
            <div className="col-span-1 text-right">Actions</div>
          )}
        </div>
      )}

      {/* SCROLLABLE LIST */}
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
          {projects.map((p, index) => (
            <div
              key={p.id}
              className="
                grid grid-cols-14 items-center
                border rounded-lg px-4 py-4
                bg-background
                hover:bg-gray-50
                transition-colors
              "
            >
              {/* SERIAL */}
              <div className="col-span-1 text-muted-foreground">
                {index + 1}
              </div>

              {/* PROJECT ID */}
              <div className="col-span-2 font-mono text-sm text-gray-600">
                {p.id}
              </div>

              {/* PROJECT */}
              <div className="col-span-3">
                <div className="font-semibold">{p.project_name}</div>
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(p.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* STATUS */}
              <div className="col-span-2">
                <Badge
                  className={
                    p.status === "Completed"
                      ? "bg-green-500 text-white"
                      : p.status === "Ongoing"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-400 text-black"
                  }
                >
                  {p.status}
                </Badge>
              </div>

              {/* BUDGET */}
              <div className="col-span-2 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                ₹{Number(p.budget || 0).toLocaleString()}
              </div>

              {/* PROGRESS */}
              <div className="col-span-2">
                <StatusSteps status={p.status} />
              </div>

              {/* TEAM */}
              <div className="col-span-1 flex -space-x-2">
                {p.employees.map((e) => (
                  <Avatar
                    key={e.id}
                    className="h-8 w-8 border border-background"
                  >
                    <AvatarFallback>
                      {e.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
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
          ))}
        </div>
      </ScrollArea>

      {/* MODALS */}
      {add && (
        <AddProject
          onClose={() => setAdd(false)}
          onSuccess={() => {
            setAdd(false);
            load();
          }}
        />
      )}

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