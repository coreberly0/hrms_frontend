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
import { Spinner } from "@/components/ui/spinner";

import { X } from "lucide-react";
import { toast } from "sonner";

import {
  updateProject,
  assignEmployeeToProject,
  removeEmployeeFromProject,
} from "@/services/projectService";
import { getEmployees } from "@/services/employee";

export default function EditProject({ project, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [assignedIds, setAssignedIds] = useState([]);
  const [initialAssignedIds, setInitialAssignedIds] = useState([]);
  const [selectKey, setSelectKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    project_name: "",
    description: "",
    budget: "",
    status: "Ongoing",
  });

  /* LOAD EMPLOYEES */
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        // Try local API first
        let data = null;
        try {
          const res = await fetch("/api/employees");
          if (res.ok) {
            data = await res.json();
          }
        } catch (err) {
          console.log("Local API failed, trying external API...", err.message);
        }

        // Fallback to external API
        if (!data) {
          data = await getEmployees();
        }

        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Failed to load employees:", err.message);
      }
    };
    loadEmployees();
  }, []);

  /* SYNC PROJECT DATA */
  useEffect(() => {
    if (!project) return;

    setForm({
      project_name: project.project_name || "",
      description: project.description || "",
      budget: project.budget || "",
      status: project.status || "Ongoing",
    });

    const ids = Array.isArray(project.employees)
      ? project.employees.map((e) => e.id)
      : [];

    setAssignedIds(ids);
    setInitialAssignedIds(ids);
    setSelectKey((k) => k + 1);
  }, [project]);

  /* LOCAL ADD */
  const addEmployee = (id) => {
    if (assignedIds.includes(id)) return;
    setAssignedIds((prev) => [...prev, id]);
    setSelectKey((k) => k + 1);
  };

  /* LOCAL REMOVE */
  const removeEmployee = (id) => {
    setAssignedIds((prev) => prev.filter((eid) => eid !== id));
    setSelectKey((k) => k + 1);
  };

  /* FAST SAVE (PARALLEL API CALLS) */
  const submit = async () => {
    try {
      setLoading(true);

      // 1️⃣ Update project details
      await updateProject(project.id, form);

      // 2️⃣ Calculate changes
      const added = assignedIds.filter(
        (id) => !initialAssignedIds.includes(id)
      );

      const removed = initialAssignedIds.filter(
        (id) => !assignedIds.includes(id)
      );

      // 3️⃣ Run assign/remove in parallel
      await Promise.all([
        ...added.map((id) =>
          assignEmployeeToProject({
            project_id: project.id,
            employee_id: id,
          })
        ),
        ...removed.map((id) =>
          removeEmployeeFromProject(project.id, id)
        ),
      ]);

      toast.success("Project updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Project</DialogTitle>
          <DialogDescription>
            Update project details and manage assignments
          </DialogDescription>
        </DialogHeader>

        {/* PROJECT DETAILS */}
        <div className="space-y-3">
          <Input
            placeholder="Project Name"
            value={form.project_name}
            onChange={(e) =>
              setForm({ ...form, project_name: e.target.value })
            }
            disabled={loading}
          />

          <Textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            disabled={loading}
          />

          <Input
            type="number"
            placeholder="Budget"
            value={form.budget}
            onChange={(e) =>
              setForm({ ...form, budget: e.target.value })
            }
            disabled={loading}
          />
        </div>

        <Separator />

        {/* STATUS */}
        <Select
          value={form.status}
          onValueChange={(value) =>
            setForm({ ...form, status: value })
          }
          disabled={loading}
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

        <Separator />

        {/* ASSIGNED EMPLOYEES */}
        <div className="space-y-3">
          {assignedIds.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No employees assigned
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {assignedIds.map((id) => {
                const emp = employees.find((e) => e.id === id);
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {emp?.name}
                    <button
                      type="button"
                      onClick={() => removeEmployee(id)}
                      disabled={loading}
                      className="ml-1 rounded hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}

          <Select
            key={selectKey}
            onValueChange={(value) => addEmployee(Number(value))}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Assign Employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem
                  key={emp.id}
                  value={emp.id.toString()}
                  disabled={assignedIds.includes(emp.id)}
                >
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button onClick={submit} disabled={loading}>
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}