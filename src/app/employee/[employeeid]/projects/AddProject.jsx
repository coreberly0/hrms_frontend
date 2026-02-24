"use client";

import { useState } from "react";
import { createProject } from "@/services/projectService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AddProject({ onSuccess }) {
  const [form, setForm] = useState({
    project_name: "",
    description: "",
    client_name: "",
    start_date: "",
    end_date: "",
    budget: "",
    status: "Ongoing",
    progress: 0,
  });

  const submit = async () => {
    await createProject({
      ...form,
      budget: Number(form.budget),
      progress: Number(form.progress),
    });
    onSuccess();
  };

  return (
    <div className="space-y-3">
      <Input placeholder="Project Name"  onChange={(e)=>setForm({...form,project_name:e.target.value})} />
      <Input placeholder="Client Name" onChange={(e)=>setForm({...form,client_name:e.target.value})} />
      <Textarea placeholder="Description" onChange={(e)=>setForm({...form,description:e.target.value})} />
      <Input type="date" onChange={(e)=>setForm({...form,start_date:e.target.value})} />
      <Input type="date" onChange={(e)=>setForm({...form,end_date:e.target.value})} />
      <Input placeholder="Budget" type="number" onChange={(e)=>setForm({...form,budget:e.target.value})} />
      <Input placeholder="Progress %" type="number" onChange={(e)=>setForm({...form,progress:e.target.value})} />
      <Button onClick={submit}>Create Project</Button>
    </div>
  );
}