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
    { name: "Completed", value: 10 },
    { name: "Pending", value: 3 },
    { name: "Overdue", value: 2 }
  ];

  const chartConfig = {
    value: {
      label: "Tasks",
      color: "hsl(var(--chart-1))"
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-100 min-h-screen">

      {/* Top Section */}

      <div className="space-y-3">

        {/* Welcome Header */}

        <div className="flex w-full flex-col gap-2 px-1 py-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Welcome back👋, {employeeName}
            </h2>
            <p className="mt-1 text-slate-600">Here&apos;s what&apos;s happening today.</p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-sm font-semibold text-slate-700">{dayLabel}</p>
            <p className="text-sm text-slate-600">{dateLabel}</p>
            <p className="text-lg font-bold text-slate-900 tabular-nums">{timeLabel}</p>
          </div>
        </div>

        {/* Attendance & Announcement */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Card */}
          <div className="min-w-0 lg:h-[320px]">
            <AttendanceCheck />
          </div>

          {/* Announcement Card */}
          <Card className="shadow-md flex flex-col lg:h-[320px]">
            <CardContent className="p-4 flex h-full min-h-0 flex-col">
              <h3 className="text-lg font-semibold mb-4">Announcements</h3>
              <ScrollArea className="min-h-0 flex-1 pr-4">
                <div className="space-y-3 pb-2">
                  <div className="border-l-4 border-blue-500 pl-3 py-2">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">Info</p>
                    </div>
                    <p className="text-sm mt-1">Server maintenance scheduled for Sunday.</p>
                    <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-3 py-2">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">New</p>
                    </div>
                    <p className="text-sm mt-1">Policy update: Annual Leave carry-over enabled.</p>
                    <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-3 py-2">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">Alert</p>
                    </div>
                    <p className="text-sm mt-1">Team standup meeting at 3:00 PM today.</p>
                    <p className="text-xs text-slate-500 mt-1">1 hour ago</p>
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

          <h3 className="text-lg font-semibold mb-4">
            Task Productivity
          </h3>

          {/* FIXED CHART CONTAINER */}

          <div className="w-full min-w-0 h-[320px]">

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
                  fill="var(--color-value)"
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
