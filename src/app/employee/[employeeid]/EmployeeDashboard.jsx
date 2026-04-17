"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEmployeeById } from "@/services/employee";
import { getLeaveBalance } from "@/services/leaveService";

import HRAnalytics from "@/components/dashboard/HRAnalytics";
import ManagerAnalytics from "@/components/dashboard/ManagerAnalytics";
import AttendanceCheck from "./AttendanceCheck";

import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

import { Wallet, CalendarDays } from "lucide-react";

export default function EmployeeDashboard({ employeeid }) {

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      try {
        const emp = await getEmployeeById(employeeid);
        setEmployee(emp);

        const balance = await getLeaveBalance();
        setLeaveBalance(balance || {});
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [employeeid]);

  useEffect(() => {
    const t = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const role = employee?.role?.toLowerCase()?.trim();
  const name = employee?.employeeName || employee?.name || "";

  const day = currentDateTime.toLocaleDateString("en-US", { weekday: "long" });
  const date = currentDateTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const time = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const chartData = [
    { name: "Completed", value: 10, fill: "#1C225B" },
    { name: "Pending", value: 3, fill: "#3d4a8f" },
    { name: "Overdue", value: 2, fill: "#64748b" }
  ];

  const chartConfig = {
    value: { label: "Tasks" }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-6 space-y-6">

      {/* HEADER (CLEAN + BALANCED) */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b pb-4">

        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Welcome back, {name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {role === "hr"
              ? "HR Overview Dashboard"
              : role === "manager"
              ? "Manager Control Dashboard"
              : "Employee Workspace"}
          </p>
        </div>

        <div className="text-sm text-right text-muted-foreground mt-2 md:mt-0">
          <div className="font-medium text-foreground">{day}</div>
          <div>{date}</div>
          <div>{time}</div>
        </div>

      </div>

      {/* LEAVE BALANCE (PRIMARY KPI SECTION) */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2">
          <Wallet className="h-5 w-5" />
          <CardTitle className="text-base">Leave Balance</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(leaveBalance).map(([key, value]) => (
              <div
                key={key}
                className="border rounded-lg p-4 text-center bg-white dark:bg-slate-900"
              >
                <CalendarDays className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground uppercase">
                  {key}
                </p>
                <p className="text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI ROW (CLEAN ALIGNMENT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="shadow-sm">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Total Tasks</p>
            <p className="text-2xl font-semibold">15</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-semibold text-green-600">10</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold text-orange-500">5</p>
          </CardContent>
        </Card>

      </div>

      {/* MAIN CONTENT GRID (BALANCED FLOW) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ATTENDANCE */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceCheck />
          </CardContent>
        </Card>

        {/* ANNOUNCEMENTS */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[220px] pr-2">
              <div className="space-y-3 text-sm">
                <p>Server maintenance Sunday</p>
                <p>Leave policy updated</p>
                <p>Meeting at 3 PM</p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* ANALYTICS */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Task Analytics</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[220px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" outerRadius={80}>
                      {chartData.map((e, i) => (
                        <Cell key={i} fill={e.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ROLE BASED SECTION (BOTTOM LAYER) */}
      <div className="pt-2">
        {role === "hr" && <HRAnalytics />}
        {role === "manager" && <ManagerAnalytics />}
      </div>

    </div>
  );
}