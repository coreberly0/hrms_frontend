"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { CheckCircle, Clock, FolderKanban } from "lucide-react"

const data = [
  { name: "Completed", value: 5 },
  { name: "In Progress", value: 3 },
  { name: "Pending", value: 2 },
]

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"]

export default function EmployeeDashboard() {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl font-bold">Welcome Back, Kishore 👋</h1>
        <p className="text-muted-foreground text-sm">
          Here’s your work summary for today
        </p>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Active Projects
              </p>
              <h2 className="text-2xl font-bold">3</h2>
            </div>
            <FolderKanban className="text-blue-500 h-8 w-8" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Tasks Completed
              </p>
              <h2 className="text-2xl font-bold">5</h2>
            </div>
            <CheckCircle className="text-green-500 h-8 w-8" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Tasks
              </p>
              <h2 className="text-2xl font-bold">2</h2>
            </div>
            <Clock className="text-yellow-500 h-8 w-8" />
          </CardContent>
        </Card>

      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== TASK STATUS PIE ===== */}
        <Card className="lg:col-span-1 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ===== CURRENT WORK ===== */}
        <Card className="lg:col-span-2 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Current Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">

            <div className="p-4 bg-slate-100 rounded-xl">
              ✔ Completed “Login Page UI”
            </div>

            <div className="p-4 bg-blue-50 text-blue-700 rounded-xl">
              🛠 Working on “Payroll API integration”
            </div>

            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl">
              📁 Assigned to “Inventory App”
            </div>

          </CardContent>
        </Card>

      </div>

      {/* ===== RECENT ACTIVITY ===== */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• Updated project documentation</p>
          <p>• Fixed authentication bug</p>
          <p>• Attended sprint meeting</p>
        </CardContent>
      </Card>

    </div>
  )
}