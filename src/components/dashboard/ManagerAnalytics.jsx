"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Briefcase } from "lucide-react";

export default function ManagerAnalytics() {
  // Team member scores
  const teamMembersData = [
    { name: "Kishore", score: 89, completion: 92 },
    { name: "Reshma", score: 85, completion: 88 },
    { name: "Bala", score: 81, completion: 80 },
    { name: "Priya", score: 78, completion: 75 },
    { name: "Arun", score: 84, completion: 87 },
    { name: "Divya", score: 82, completion: 85 },
    { name: "Rohan", score: 80, completion: 78 },
    { name: "Neha", score: 83, completion: 85 },
  ];

  // Project Completion Data
  const projectCompletionData = [
    { project: "Project Alpha", completion: 85 },
    { project: "Project Beta", completion: 62 },
    { project: "Project Gamma", completion: 100 },
    { project: "Project Delta", completion: 45 },
    { project: "Project Epsilon", completion: 78 },
  ];

  // Overdue Tasks per Project
  const overdueTasksData = [
    { project: "Project Alpha", overdue: 2 },
    { project: "Project Beta", overdue: 5 },
    { project: "Project Gamma", overdue: 0 },
    { project: "Project Delta", overdue: 4 },
    { project: "Project Epsilon", overdue: 3 },
  ];

  // Active vs Completed Projects Trend
  const projectsTrendData = [
    { month: "Aug", active: 3, completed: 0 },
    { month: "Sep", active: 4, completed: 0 },
    { month: "Oct", active: 4, completed: 1 },
    { month: "Nov", active: 5, completed: 1 },
    { month: "Dec", active: 4, completed: 2 },
    { month: "Jan", active: 4, completed: 1 },
    { month: "Feb", active: 4, completed: 1 },
  ];

  // Project Status Distribution
  const projectStatusData = [
    { name: "On Track", value: 3, fill: "#1C225B" },
    { name: "At Risk", value: 1, fill: "#3d4a8f" },
    { name: "Completed", value: 1, fill: "#64748b" },
  ];

  return (
    <div className="flex gap-4 w-full">
      {/* Card 1: Team Performance Overview */}
      <div className="w-1/2">
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: '#1C225B' }} />
              <div>
                <CardTitle className="text-base font-semibold">Team Performance Overview</CardTitle>
                <CardDescription className="text-xs">Team member scores and completion rates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Team KPI Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 rounded text-center border" style={{ backgroundColor: '#0f172a', borderColor: '#1C225B' }}>
                <p className="text-xs font-medium text-white">Avg Score</p>
                <p className="text-lg font-bold" style={{ color: '#1C225B' }}>82</p>
              </div>
              <div className="p-2 rounded text-center border" style={{ backgroundColor: '#1C225B', borderColor: '#1C225B' }}>
                <p className="text-xs font-medium text-white">Completion</p>
                <p className="text-lg font-bold text-white">84%</p>
              </div>
              <div className="p-2 rounded text-center border" style={{ backgroundColor: '#3d4a8f', borderColor: '#1C225B' }}>
                <p className="text-xs font-medium text-white">Members</p>
                <p className="text-lg font-bold text-white">8</p>
              </div>
              <div className="p-2 rounded text-center border" style={{ backgroundColor: '#64748b', borderColor: '#1C225B' }}>
                <p className="text-xs font-medium text-white">Ranking</p>
                <p className="text-lg font-bold text-white">Top 15%</p>
              </div>
            </div>

            {/* Individual Team Member Scores Bar Chart */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Individual Member Scores</p>
              <div className="h-44">
                <ChartContainer
                  config={{
                    score: { label: "Performance Score", color: "#3b82f6" },
                  }}
                  className="h-full w-full"
                >
                  <BarChart data={teamMembersData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" fill="#1C225B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card 2: Project Efficiency Analytics */}
      <div className="w-1/2">
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" style={{ color: '#1C225B' }} />
              <div>
                <CardTitle className="text-base font-semibold">Project Efficiency Analytics</CardTitle>
                <CardDescription className="text-xs">Project completion and workload metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Project KPI Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2 rounded text-center border" style={{ backgroundColor: '#0f172a', borderColor: '#1C225B' }}>
                <p className="text-xs font-medium text-white">Active</p>
                <p className="text-lg font-bold" style={{ color: '#1C225B' }}>4</p>
              </div>
              <div className="p-2 rounded text-center border" style={{ backgroundColor: '#1C225B', borderColor: '#1C225B' }}>
                <p className="text-xs font-medium text-white">Completed</p>
                <p className="text-lg font-bold text-white">1</p>
              </div>
              <div className="p-2 rounded text-center border" style={{ backgroundColor: '#3d4a8f', borderColor: '#1C225B' }}>
                <p className="text-xs font-medium text-white">Avg Time</p>
                <p className="text-lg font-bold text-white">18d</p>
              </div>
              <div className="p-2 rounded text-center border" style={{ backgroundColor: '#64748b', borderColor: '#1C225B' }}>
                <p className="text-xs font-medium text-white">Overdue</p>
                <p className="text-lg font-bold text-white">14</p>
              </div>
            </div>

            {/* Project Completion % Bar Chart */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Project Completion %</p>
              <div className="h-32">
                <ChartContainer
                  config={{
                    completion: { label: "Completion %", color: "#60a5fa" },
                  }}
                  className="h-full w-full"
                >
                  <BarChart data={projectCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="project" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={50} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completion" fill="#3d4a8f" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Overdue Tasks per Project Bar Chart */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Overdue Tasks per Project</p>
              <div className="h-32">
                <ChartContainer
                  config={{
                    overdue: { label: "Overdue Tasks", color: "#93c5fd" },
                  }}
                  className="h-full w-full"
                >
                  <BarChart data={overdueTasksData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="project" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={50} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="overdue" fill="#64748b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Active vs Completed Projects Trend */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Active vs Completed Projects</p>
              <div className="h-32">
                <ChartContainer
                  config={{
                    active: { label: "Active", color: "#2563eb" },
                    completed: { label: "Completed", color: "#60a5fa" },
                  }}
                  className="h-full w-full"
                >
                  <LineChart data={projectsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line type="monotone" dataKey="active" stroke="#1C225B" strokeWidth={2} dot={{ fill: "#1C225B" }} />
                    <Line type="monotone" dataKey="completed" stroke="#3d4a8f" strokeWidth={2} dot={{ fill: "#3d4a8f" }} />
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
