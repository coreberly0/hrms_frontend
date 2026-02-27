"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Users } from "lucide-react";

export default function HRAnalytics() {
  // Workforce Productivity Data - Department-wise Productivity
  const departmentProductivity = [
    { dept: "IT", productivity: 85 },
    { dept: "HR", productivity: 78 },
    { dept: "Finance", productivity: 82 },
    { dept: "Operations", productivity: 75 },
    { dept: "Sales", productivity: 88 },
  ];

  // Task Status Distribution - Donut Chart
  const taskStatusData = [
    { name: "Completed", value: 72, fill: "#22c55e" },
    { name: "Pending", value: 18, fill: "#f59e0b" },
    { name: "Overdue", value: 10, fill: "#ef4444" },
  ];

  // Monthly Productivity Trend
  const productivityTrend = [
    { month: "Aug", trend: 72 },
    { month: "Sep", trend: 75 },
    { month: "Oct", trend: 78 },
    { month: "Nov", trend: 81 },
    { month: "Dec", trend: 80 },
    { month: "Jan", trend: 83 },
    { month: "Feb", trend: 85 },
  ];

  // Performance Distribution Data
  const performanceDistribution = [
    { name: "High Performers", value: 35, fill: "#3b82f6" },
    { name: "Average Performers", value: 48, fill: "#6366f1" },
    { name: "Low Performers", value: 17, fill: "#ef4444" },
  ];

  // Department-wise Performance Average
  const departmentPerformance = [
    { dept: "IT", avg: 82 },
    { dept: "HR", avg: 76 },
    { dept: "Finance", avg: 80 },
    { dept: "Operations", avg: 74 },
    { dept: "Sales", avg: 85 },
  ];

  // Performance Improvement Trend
  const performanceTrend = [
    { month: "Aug", high: 30, avg: 52, low: 18 },
    { month: "Sep", high: 31, avg: 50, low: 19 },
    { month: "Oct", high: 33, avg: 49, low: 18 },
    { month: "Nov", high: 34, avg: 48, low: 18 },
    { month: "Dec", high: 35, avg: 48, low: 17 },
    { month: "Jan", high: 36, avg: 47, low: 17 },
    { month: "Feb", high: 35, avg: 48, low: 17 },
  ];

  return (
    <div className="flex gap-4 w-full">
      {/* Card 1: Workforce Productivity Index */}
      <div className="w-1/2">
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle className="text-base font-semibold">Workforce Productivity Index</CardTitle>
                <CardDescription className="text-xs">Organization-wide productivity metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 p-2 rounded text-center border border-blue-200">
                <p className="text-xs text-blue-700 font-medium">Overall Score</p>
                <p className="text-xl font-bold text-blue-900">78</p>
              </div>
              <div className="bg-green-50 p-2 rounded text-center border border-green-200">
                <p className="text-xs text-green-700 font-medium">Completed</p>
                <p className="text-xl font-bold text-green-900">72%</p>
              </div>
              <div className="bg-red-50 p-2 rounded text-center border border-red-200">
                <p className="text-xs text-red-700 font-medium">Overdue</p>
                <p className="text-xl font-bold text-red-900">10%</p>
              </div>
            </div>

            {/* Department-wise Productivity Bar Chart */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Department-wise Productivity</p>
              <div className="h-40">
                <ChartContainer
                  config={{
                    productivity: { label: "Productivity %", color: "#3b82f6" },
                  }}
                  className="h-full w-full"
                >
                  <BarChart data={departmentProductivity}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="dept" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="productivity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Task Status Donut Chart */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Task Status Distribution</p>
              <div className="h-40 flex items-center justify-center">
                <ChartContainer config={{}} className="h-full w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie data={taskStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>

            {/* Monthly Trend */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Monthly Productivity Trend</p>
              <div className="h-32">
                <ChartContainer
                  config={{
                    trend: { label: "Score", color: "#3b82f6" },
                  }}
                  className="h-full w-full"
                >
                  <LineChart data={productivityTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9 }} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="trend" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card 2: Employee Performance Distribution */}
      <div className="w-1/2">
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <CardTitle className="text-base font-semibold">Performance Distribution</CardTitle>
                <CardDescription className="text-xs">Employee performance categorization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Performance Category Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 p-2 rounded text-center border border-blue-200">
                <p className="text-xs text-blue-700 font-medium">High</p>
                <p className="text-xl font-bold text-blue-900">35</p>
              </div>
              <div className="bg-indigo-50 p-2 rounded text-center border border-indigo-200">
                <p className="text-xs text-indigo-700 font-medium">Average</p>
                <p className="text-xl font-bold text-indigo-900">48</p>
              </div>
              <div className="bg-red-50 p-2 rounded text-center border border-red-200">
                <p className="text-xs text-red-700 font-medium">Low</p>
                <p className="text-xl font-bold text-red-900">17</p>
              </div>
            </div>

            {/* Performance Categories Pie Chart */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Performance Categories</p>
              <div className="h-40 flex items-center justify-center">
                <ChartContainer config={{}} className="h-full w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie data={performanceDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>

            {/* Department-wise Performance Bar Chart */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Department-wise Avg Performance</p>
              <div className="h-40">
                <ChartContainer
                  config={{
                    avg: { label: "Average Score", color: "#8b5cf6" },
                  }}
                  className="h-full w-full"
                >
                  <BarChart data={departmentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="dept" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avg" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Performance Trend Line Chart */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Performance Improvement Trend</p>
              <div className="h-32">
                <ChartContainer
                  config={{
                    high: { label: "High", color: "#3b82f6" },
                    avg: { label: "Average", color: "#8b5cf6" },
                    low: { label: "Low", color: "#ef4444" },
                  }}
                  className="h-full w-full"
                >
                  <LineChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line type="monotone" dataKey="high" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="avg" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
