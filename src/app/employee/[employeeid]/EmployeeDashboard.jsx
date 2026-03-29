"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEmployeeById } from "@/services/employee";

import HRAnalytics from "@/components/dashboard/HRAnalytics";
import ManagerAnalytics from "@/components/dashboard/ManagerAnalytics";
import AttendanceCheck from "./AttendanceCheck";

import { PieChart, Pie } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

export default function EmployeeDashboard({ employeeid }) {

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(employeeid);
        if (data) setEmployee(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) fetchEmployee();
  }, [employeeid, mounted]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const role = employee?.role?.toLowerCase()?.trim();
  const employeeName = employee?.employeeName || employee?.name || "";
  const dayLabel = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const dateLabel = currentDateTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeLabel = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const dateTimeLabel = `${dayLabel}, ${dateLabel} ${timeLabel}`;

  const chartData = [
    { name: "Completed", value: 10, fill: "#1C225B" },
    { name: "Pending", value: 3, fill: "#3d4a8f" },
    { name: "Overdue", value: 2, fill: "#64748b" }
  ];

  const chartConfig = {
    value: {
      label: "Tasks",
      color: "hsl(var(--chart-1))"
    }
  };

  return (
    <div className="px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-1 space-y-4 bg-background min-h-screen">

      {/* Top Section */}

      <div className="space-y-2">

        {/* Welcome Header */}

        <div className="flex w-full flex-col gap-2 px-1 py-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Welcome back👋, {employeeName}
            </h2>
            <p className="mt-1 text-muted-foreground">Here&apos;s what&apos;s happening today.</p>
          </div>

          <div className="shrink-0 text-left sm:text-right flex flex-col gap-2 items-end">
            <p className="text-sm font-semibold text-foreground">{dayLabel}</p>
            <p className="text-sm text-muted-foreground">{dateLabel}</p>
          </div>
        </div>

        {/* Attendance & Announcement */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Card */}
          <div className="min-w-0 lg:h-[300px]">
            <AttendanceCheck />
          </div>

          {/* Announcement Card */}
          <Card className="shadow-md flex flex-col lg:h-[300px]">
            <CardContent className="px-4 pt-2 pb-4 flex h-full min-h-0 flex-col">
              <h3 className="text-lg font-semibold mb-3 text-foreground">Announcements</h3>
              <ScrollArea className="min-h-0 flex-1 pr-4">
                <div className="space-y-3 pb-2">
                  <div className="border-l-4 border-blue-500 pl-3 py-2 dark:border-blue-400">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-blue-600 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/30 px-2 py-1 rounded">Info</p>
                    </div>
                    <p className="text-sm mt-1 text-foreground">Server maintenance scheduled for Sunday.</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-3 py-2 dark:border-green-400">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900/30 px-2 py-1 rounded">New</p>
                    </div>
                    <p className="text-sm mt-1 text-foreground">Policy update: Annual Leave carry-over enabled.</p>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-3 py-2 dark:border-orange-400">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-orange-600 bg-orange-100 dark:text-orange-200 dark:bg-orange-900/30 px-2 py-1 rounded">Alert</p>
                    </div>
                    <p className="text-sm mt-1 text-foreground">Team standup meeting at 3:00 PM today.</p>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Chart Section */}

      <Card className="shadow-md">

        <CardContent className="p-6">

          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Task Productivity
          </h3>

          {/* FIXED CHART CONTAINER */}

          <div className="w-full min-w-0 h-[260px]">

            <ChartContainer
              config={chartConfig}
              className="w-full h-full"
            >

              <PieChart width={400} height={300}>

                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />

              </PieChart>

            </ChartContainer>

          </div>

        </CardContent>

      </Card>

      {/* Role Based Analytics */}

      {role === "hr" && <HRAnalytics />}
      {role === "manager" && <ManagerAnalytics />}

    </div>
  );
}
