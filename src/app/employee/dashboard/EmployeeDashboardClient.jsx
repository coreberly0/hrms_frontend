"use client"

import { useSearchParams } from "next/navigation"

export default function EmployeeDashboardClient() {
  const searchParams = useSearchParams()

  const companyId = searchParams.get("companyId")
  const companyName = searchParams.get("companyName")

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Employee Dashboard</h1>

      <div className="mt-4 rounded border p-4">
        <p><strong>Company:</strong> {companyName}</p>
        <p><strong>Company ID:</strong> {companyId}</p>
      </div>
    </div>
  )
}
