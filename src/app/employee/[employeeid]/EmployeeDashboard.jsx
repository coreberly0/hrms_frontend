"use client";

import { useEffect, useState } from "react";
import { getEmployeeById } from "@/services/employee";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Briefcase,
  CheckCircle,
  Clock,
  Layers,
  Calendar,
  User,
} from "lucide-react";

/* ===== STATIC UI DATA (Later replace with API) ===== */
const pieColors = ["#22c55e", "#3b82f6", "#f97316"];

const taskPieData = [
  { name: "Completed", value: 21 },
  { name: "In Progress", value: 7 },
  { name: "Pending", value: 5 },
];

const barData = [
  { month: "Jan", tasks: 12 },
  { month: "Feb", tasks: 18 },
  { month: "Mar", tasks: 22 },
  { month: "Apr", tasks: 16 },
];

const projects = [
  { name: "HR Management System", role: "Frontend", status: "Ongoing" },
  { name: "Inventory App", role: "Backend", status: "Completed" },
  { name: "Payroll System", role: "Full Stack", status: "Ongoing" },
];

export default function EmployeeDashboard({ employeeid }) {
  const [emp, setEmp] = useState(null);

  useEffect(() => {
    if (!employeeid) return;
    getEmployeeById(employeeid).then(setEmp);
  }, [employeeid]);

  if (!emp) return null;

  const stats = [
    { title: "Projects", value: 4, icon: Briefcase },
    { title: "Tasks Pending", value: 7, icon: Clock },
    { title: "Tasks Completed", value: 21, icon: CheckCircle },
    { title: "Working Days", value: 18, icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">

      {/* ===== HEADER ===== */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-white">
              <AvatarFallback className="bg-slate-800 text-xl font-bold">
                {emp.name?.[0]}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-xl font-semibold">
                Welcome, {emp.name}
              </h1>
              <p className="text-sm text-slate-300">
                {emp.role} • {emp.department}
              </p>
            </div>
          </div>

          <Badge className="bg-green-500 px-4 py-1 text-white">
            {emp.status}
          </Badge>
        </CardContent>
      </Card>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <Card key={item.title} className="hover:shadow-lg transition">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
              <item.icon className="h-9 w-9 text-slate-400" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TASK STATUS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Task Status
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskPieData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {taskPieData.map((_, index) => (
                    <Cell key={index} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* MONTHLY TASKS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* ===== PROJECTS ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Assigned Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.map((p) => (
            <div key={p.name}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Role: {p.role}
                  </p>
                </div>
                <Badge
                  variant={
                    p.status === "Completed"
                      ? "default"
                      : "secondary"
                  }
                >
                  {p.status}
                </Badge>
              </div>
              <Separator className="mt-3" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ===== ACTIVITY ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>✔ Completed “Login Page UI”</p>
          <p>🛠 Working on “Payroll API integration”</p>
          <p>📁 Assigned to “Inventory App”</p>
        </CardContent>
      </Card>

    </div>
  );
}