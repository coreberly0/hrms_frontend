"use client"

import React from "react"
import { useSearchParams } from "next/navigation"

export default function EmployeeDashboard() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get("companyId")
  const companyName = searchParams.get("companyName")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <h1 className="text-3xl font-bold mb-4">Employee Dashboard</h1>
      <p>Welcome! You are part of company ID: <strong>{companyId}{companyName}</strong></p>
      <p>This is your personal dashboard.</p>
    </div>
  )
}
