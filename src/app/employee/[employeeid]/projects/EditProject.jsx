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

import {
  updateProject,
  assignEmployeeToProject,
  removeEmployeeFromProject,
} from "@/services/projectService";
import { getEmployees } from "@/services/employee";

export default function EditProject({ project, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);

  const [selectedEmployees, setSelectedEmployees] = useState(
    project.assigned_employees
      ? project.assigned_employees.map((e) => e.id)
      : []
  );

  // ✅ INCLUDE STATUS IN FORM
  const [form, setForm] = useState({
    project_name: project.project_name || "",
    description: project.description || "",
    budget: project.budget || "",
    status: project.status || "Not Started",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchEmployees();
  }, []);

  const addEmployee = async (id) => {
    if (selectedEmployees.includes(id)) {
      alert("Employee already assigned");
      return;
    }

    try {
      await assignEmployeeToProject({
        project_id: project.id,
        employee_id: id,
      });

      setSelectedEmployees((prev) => [...prev, id]);
    } catch (err) {
      alert(err.message);
    }
  };

  const removeEmployee = async (id) => {
    try {
      await removeEmployeeFromProject(project.id, id);
      setSelectedEmployees((prev) =>
        prev.filter((empId) => empId !== id)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const submit = async () => {
    try {
      // ✅ STATUS ALWAYS SENT
      await updateProject(project.id, {
        project_name: form.project_name,
        description: form.description,
        budget: form.budget,
        status: form.status,
      });

      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update project details, status, and assigned employees.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Project Name"
          value={form.project_name}
          onChange={(e) =>
            setForm({ ...form, project_name: e.target.value })
          }
        />

        <Textarea
          placeholder="Description"
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

        {/* ✅ STATUS SELECT (THIS FIXES YOUR BUG) */}
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

        <Select onValueChange={(value) => addEmployee(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Assign Employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={emp.id.toString()}>
                {emp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2 mt-3">
          {selectedEmployees.map((id) => {
            const emp = employees.find((e) => e.id === id);
            return (
              <div
                key={id}
                className="px-3 py-1 bg-muted rounded-full flex items-center gap-2"
              >
                {emp?.name}
                <button
                  onClick={() => removeEmployee(id)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <Button className="mt-4" onClick={submit}>
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
}