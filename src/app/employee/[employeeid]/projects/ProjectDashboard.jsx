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

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Plus, Pencil, Trash2, Wallet } from "lucide-react";

/* ---------------- STATUS STEPS ---------------- */
function StatusSteps({ status }) {
  const steps = ["Not Started", "Ongoing", "Completed"];
  const activeIndex = steps.indexOf(status);

  return (
    <div className="flex gap-1">
      {steps.map((_, i) => (
        <div
          key={i}
          className={`h-2.5 w-7 rounded-full ${
            i <= activeIndex
              ? status === "Completed"
                ? "bg-green-500"
                : status === "Ongoing"
                ? "bg-blue-500"
                : "bg-yellow-400"
              : "bg-gray-200"
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

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const paginatedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [projects, totalPages, currentPage]);

  const load = async () => {
    try {
      setLoading(true);

      const emp = await getEmployeeById(employeeid);
      const empRole = emp?.role ? emp.role.toLowerCase() : (emp?.position ? emp.position.toLowerCase() : "employee");
      setRole(empRole);

      let data = null;

      // Try local API first
      try {
        const localRes = await fetch("/api/projects");
        if (localRes.ok) {
          const allProjects = await localRes.json();
          if (empRole === "manager") {
            data = allProjects;
          } else {
            // Filter projects by employee
            data = allProjects.filter(p =>
              p.employees?.some(e => e.id === employeeid)
            );
          }
        }
      } catch (err) {
        console.log("Local API failed, trying external API...", err.message);
      }

      // Fallback to external API if local didn't work
      if (!data && empRole === "manager") {
        try {
          data = await getAllProjects();
        } catch (err) {
          console.log("External API error:", err.message);
        }
      } else if (!data) {
        try {
          data = await getProjectsByEmployee(employeeid);
        } catch (err) {
          console.log("External API error:", err.message);
        }
      }

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

  /* LOADING */
  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    /* MAIN CONTAINER — FULL HEIGHT */
    <div className="flex flex-col h-[calc(100vh-85px)] p-6 gap-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
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
      <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground px-4">
        <div className="col-span-1">#</div>
        <div className="col-span-3">Project</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Budget</div>
        <div className="col-span-2">Progress</div>
        <div className="col-span-1">Team</div>
        {role === "manager" && (
          <div className="col-span-1 text-right">Actions</div>
        )}
      </div>

      {/* SCROLLABLE LIST */}
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
          {paginatedProjects.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No projects found
            </div>
          ) : (
            paginatedProjects.map((p, index) => (
              <div
                key={p.id}
                className="grid grid-cols-12 items-center border rounded-lg px-4 py-4 bg-background hover:bg-gray-100 transition"
              >
                <div className="col-span-1 text-sm text-muted-foreground">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </div>

                <div className="col-span-3">
                  <div className="font-semibold">{p.project_name}</div>
                  <div className="text-xs text-muted-foreground">
                    ID: {p.id} •{" "}
                    {new Date(p.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="col-span-2">
                  <Badge
                    className={
                      p.status === "Completed"
                        ? "bg-green-500"
                        : p.status === "Ongoing"
                        ? "bg-blue-500"
                        : "bg-yellow-400 text-black"
                    }
                  >
                    {p.status}
                  </Badge>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  ₹{Number(p.budget || 0).toLocaleString()}
                </div>

                <div className="col-span-2">
                  <StatusSteps status={p.status} />
                </div>

                <div className="col-span-1 flex -space-x-2">
                  {p.employees.map((e) => (
                    <Avatar key={e.id} className="h-7 w-7">
                      <AvatarFallback>
                        {e.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>

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
      </ScrollArea>

      {/* PAGINATION — FIXED BOTTOM */}
      {projects.length > itemsPerPage && (
        <div className="mt-auto flex justify-center bg-background">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((p) => Math.max(p - 1, 1))
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(p + 1, totalPages)
                    )
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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