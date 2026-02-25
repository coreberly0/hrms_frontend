"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

import {
  updateProject,
  assignEmployeeToProject,
} from "@/services/projectService";
import { getEmployees } from "@/services/employee";

export default function EditProject({ project, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [assignedIds, setAssignedIds] = useState([]);
  const [selectKey, setSelectKey] = useState(0);

  const [form, setForm] = useState({
    project_name: "",
    description: "",
    budget: "",
    status: "Ongoing",
  });

  /* Load employees */
  useEffect(() => {
    getEmployees().then((data) => setEmployees(data || []));
  }, []);

  /* Sync project */
  useEffect(() => {
    if (!project) return;

    setForm({
      project_name: project.project_name || "",
      description: project.description || "",
      budget: project.budget || "",
      status: project.status || "Ongoing",
    });

    setAssignedIds(
      Array.isArray(project.employees)
        ? project.employees.map((e) => e.id)
        : []
    );

    setSelectKey((k) => k + 1);
  }, [project]);

  /* Assign employee */
  const addEmployee = async (id) => {
    if (assignedIds.includes(id)) return;

    await assignEmployeeToProject({
      project_id: project.id,
      employee_id: id,
    });

    setAssignedIds((prev) => [...prev, id]);
    setSelectKey((k) => k + 1);
  };

  /* Submit */
  const submit = async () => {
    await updateProject(project.id, form);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Edit Project
          </DialogTitle>
          <DialogDescription>
            Update project details and manage assignments
          </DialogDescription>
        </DialogHeader>

        {/* PROJECT DETAILS */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Project Details
          </h3>

          <Input
            placeholder="Project Name"
            value={form.project_name}
            onChange={(e) =>
              setForm({ ...form, project_name: e.target.value })
            }
          />

          <Textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <Input
            type="number"
            placeholder="Budget"
            value={form.budget}
            onChange={(e) =>
              setForm({ ...form, budget: e.target.value })
            }
          />
        </div>

        <Separator />

        {/* STATUS */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Project Status
          </h3>

          <Select
            value={form.status}
            onValueChange={(value) =>
              setForm({ ...form, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* ASSIGNED EMPLOYEES */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Assigned Employees
          </h3>

          {assignedIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No employees assigned
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {assignedIds.map((id) => {
                const emp = employees.find((e) => e.id === id);
                return (
                  <Badge key={id} variant="secondary">
                    {emp?.name}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* ASSIGN DROPDOWN */}
          <Select
            key={selectKey}
            onValueChange={(value) => addEmployee(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Assign Employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => {
                const assigned = assignedIds.includes(emp.id);
                return (
                  <SelectItem
                    key={emp.id}
                    value={emp.id.toString()}
                    disabled={assigned}
                  >
                    {emp.name}
                    {assigned && " (Assigned)"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}