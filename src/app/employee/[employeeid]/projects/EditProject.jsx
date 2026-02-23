"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

import { updateProject } from "@/services/projectService";
import { getEmployees } from "@/services/employee";

export default function EditProject({ project, onClose, onSuccess }) {
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(
    project.employees || []
  );

  const [form, setForm] = useState({
    project_name: project.project_name,
    description: project.description,
    budget: project.budget,
  });

  useEffect(() => {
    getEmployees(token).then(setEmployees);
  }, []);

  const addEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      alert("Employee already assigned");
      return;
    }
    setSelectedEmployees([...selectedEmployees, id]);
  };

  const removeEmployee = (id) => {
    setSelectedEmployees(
      selectedEmployees.filter((empId) => empId !== id)
    );
  };

  const submit = async () => {
    await updateProject(
      project.id,
      {
        ...form,
        employees: selectedEmployees,
      },
      token
    );

    onSuccess();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <Input
          value={form.project_name}
          onChange={(e) =>
            setForm({ ...form, project_name: e.target.value })
          }
        />

        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

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

        <div className="flex flex-wrap gap-2">
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

        <Button onClick={submit}>Update</Button>
      </DialogContent>
    </Dialog>
  );
}