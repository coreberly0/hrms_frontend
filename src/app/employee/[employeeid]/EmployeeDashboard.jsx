"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
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

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const role = employee?.role?.toLowerCase()?.trim();

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Welcome Card */}

        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white">

          <CardContent className="p-6">

            <div className="flex justify-between items-start">

              <div>
                <h2 className="text-3xl font-bold">Welcome Back 👋</h2>

                <p className="text-2xl font-semibold mt-2">
                  {employee?.employeeName || employee?.name || ""}
                </p>

                <p className="text-sm mt-3 opacity-90">
                  Let's make today productive 🚀
                </p>
              </div>

              <div className="bg-white/20 p-3 rounded-lg">
                <Sparkles className="h-6 w-6" />
              </div>

            </div>

            <div className="mt-6 bg-white/20 rounded-lg p-3 text-sm">
              “Consistency is what transforms average into excellence.”
            </div>

          </CardContent>

        </Card>

        {/* Attendance */}

        <div className="min-w-0">
          <AttendanceCheck />
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
