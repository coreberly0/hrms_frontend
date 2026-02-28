"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  createProject,
  assignEmployeeToProject,
} from "@/services/projectService";
import { getEmployees } from "@/services/employee";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

/* =======================
   SCHEMA
======================= */
const projectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  client_name: z.string().min(1, "Client name is required"),
  description: z.string().optional(),
  budget: z
    .number({
      required_error: "Budget is required",
      invalid_type_error: "Budget must be a number",
    })
    .positive("Budget must be greater than 0"),
  status: z.enum(["Not Started", "Ongoing", "Completed"]),
});

export default function AddProject({ onClose, onSuccess }) {
  const [loading, setLoading] = React.useState(false);
  const [employees, setEmployees] = React.useState([]);
  const [assignedIds, setAssignedIds] = React.useState([]);
  const [selectKey, setSelectKey] = React.useState(0);

  /* LOAD EMPLOYEES */
  React.useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load employees");
      }
    };
    loadEmployees();
  }, []);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: "",
      client_name: "",
      description: "",
      budget: undefined,
      status: "Ongoing",
    },
  });

  /* ADD EMPLOYEE (MULTI) */
  const addEmployee = (id) => {
    if (assignedIds.includes(id)) return;

    setAssignedIds((prev) => [...prev, id]);
    setSelectKey((k) => k + 1);
  };

  /* REMOVE EMPLOYEE BEFORE SAVE */
  const removeEmployee = (id) => {
    setAssignedIds((prev) => prev.filter((eid) => eid !== id));
    setSelectKey((k) => k + 1);
  };

  /* SUBMIT */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const project = await createProject(data);

      // Assign multiple employees
      for (const empId of assignedIds) {
        await assignEmployeeToProject({
          project_id: project.id,
          employee_id: empId,
        });
      }

      toast.success("Project created successfully");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Add Project
          </DialogTitle>
          <DialogDescription>
            Create project and manage employee assignments
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* PROJECT DETAILS */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Project Details
            </h3>

            <Input
              placeholder="Project Name"
              {...form.register("project_name")}
              disabled={loading}
            />

            <Input
              placeholder="Client Name"
              {...form.register("client_name")}
              disabled={loading}
            />

            <Textarea
              placeholder="Description"
              rows={3}
              {...form.register("description")}
              disabled={loading}
            />

            <Input
              type="number"
              placeholder="Budget"
              disabled={loading}
              {...form.register("budget", {
                valueAsNumber: true,
              })}
            />
          </div>

          <Separator />

          {/* STATUS */}
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Project Status
                </h3>

                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">
                      Not Started
                    </SelectItem>
                    <SelectItem value="Ongoing">
                      Ongoing
                    </SelectItem>
                    <SelectItem value="Completed">
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Separator />

          {/* ASSIGNED EMPLOYEES SECTION */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Assigned Employees
            </h3>

            {assignedIds.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No employees selected
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {assignedIds.map((id) => {
                  const emp = employees.find((e) => e.id === id);
                  const name =
                    emp?.name ||
                    `${emp?.first_name || ""} ${emp?.last_name || ""}`;

                  return (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="flex items-center gap-1 pr-1"
                    >
                      {name}

                      <button
                        type="button"
                        onClick={() => removeEmployee(id)}
                        className="ml-1 rounded hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* ASSIGN DROPDOWN */}
            <Select
              key={selectKey}
              onValueChange={(value) =>
                addEmployee(Number(value))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign Employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => {
                  const assigned = assignedIds.includes(emp.id);
                  const name =
                    emp.name ||
                    `${emp.first_name || ""} ${emp.last_name || ""}`;

                  return (
                    <SelectItem
                      key={emp.id}
                      value={emp.id.toString()}
                      disabled={assigned}
                    >
                      {name}
                      {assigned && " (Selected)"}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}