"use client"

import React from "react"
import { useSearchParams } from "next/navigation"

export default function HrDashboardPage() {
  const searchParams = useSearchParams()

  const companyId = searchParams.get("companyId")
  const companyName = searchParams.get("companyName")

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">HR Dashboard</h1>

        <div className="rounded-lg border bg-white dark:bg-zinc-900 p-4">
          <p className="text-sm text-zinc-500">Company</p>
          <p className="text-lg font-semibold">{companyName}</p>
          <p className="text-sm text-zinc-500">Company ID: {companyId}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4 bg-white dark:bg-zinc-900">
            👥 Manage Employees
          </div>

          <div className="rounded-lg border p-4 bg-white dark:bg-zinc-900">
            🧾 Attendance
          </div>

          <div className="rounded-lg border p-4 bg-white dark:bg-zinc-900">
            💰 Payroll
          </div>
        </div>
      </div>
    </div>
  )
}
