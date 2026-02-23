"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
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

import { createProject } from "@/services/projectService";
import { getEmployees } from "@/services/employee";

export default function AddProject({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [form, setForm] = useState({
    project_name: "",
    description: "",
    client_name: "",
    budget: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (open) {
      getEmployees(token).then(setEmployees);
    }
  }, [open]);

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
    await createProject(
      {
        ...form,
        budget: Number(form.budget),
        employees: selectedEmployees, // 👈 send assigned employees
      },
      token
    );

    setOpen(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Project</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Create project and assign employees
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Project Name"
          onChange={(e) =>
            setForm({ ...form, project_name: e.target.value })
          }
        />

        <Textarea
          placeholder="Description"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <Input
          placeholder="Client"
          onChange={(e) =>
            setForm({ ...form, client_name: e.target.value })
          }
        />

        <Input
          type="number"
          placeholder="Budget"
          onChange={(e) =>
            setForm({ ...form, budget: e.target.value })
          }
        />

        {/* EMPLOYEE SELECT */}
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

        {/* SELECTED EMPLOYEES LIST */}
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

        <Button onClick={submit}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}