"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const data = [
  { name: "Completed", value: 5, color: "#22c55e" },
  { name: "In Progress", value: 3, color: "#3b82f6" },
  { name: "Pending", value: 2, color: "#f59e0b" },
]

export default function ProjectStatusChart() {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

      {/* ===== DONUT CHART ===== */}
      <div className="h-64 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  className="hover:opacity-80 transition"
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* ===== CENTER TEXT ===== */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-muted-foreground">Total Tasks</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
      </div>

      {/* ===== LEGEND ===== */}
      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-100"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-sm font-medium">{item.name}</p>
            </div>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>

    </div>
  )
}