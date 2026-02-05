"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Sidebar from "../Sidebar"

function EmployeeDashboardClient() {

  const searchParams = useSearchParams()
  const companyId = searchParams.get("companyId")
  const companyName = searchParams.get("companyName")

  const [currentTime, setCurrentTime] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const announcements = [
    { id: 1, message: "Team meeting tomorrow at 10 AM" },
    { id: 2, message: "Holiday on Friday (Festival)" },
    { id: 3, message: "Submit monthly report by 28th" },
  ]

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">

      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">

        <div>
          <h1 className="text-3xl font-bold text-[#1C225B]">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {companyName || "TechCorp"} (ID: {companyId || "1"})
          </p>
        </div>

        <div className="text-right">
          {currentTime ? (
            <>
              <p className="text-gray-600">
                {currentTime.toLocaleDateString()}
              </p>
              <p className="text-xl font-semibold text-[#1C225B]">
                {currentTime.toLocaleTimeString()}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Today's Status</p>
          <h2 className="text-xl font-semibold text-green-600 mt-1">
            Present
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Working Hours</p>
          <h2 className="text-xl font-semibold mt-1">
            7h 45m
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">Leave Balance</p>
          <h2 className="text-xl font-semibold mt-1">
            12 Days
          </h2>
        </div>

      </div>

      {/* Announcements + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-[#1C225B] mb-4">
            Company Announcements
          </h3>

          <ul className="space-y-3 text-gray-700">
            {announcements.map(item => (
              <li key={item.id} className="flex items-center gap-2">
                📢 {item.message}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-lg font-semibold text-[#1C225B] mb-4">
            Quick Actions
          </h3>

          <div className="flex flex-col gap-3">

            <button className="bg-[#1C225B] text-white py-2 rounded-lg hover:opacity-90">
              Mark Attendance
            </button>

            <button className="bg-[#394392] text-white py-2 rounded-lg hover:opacity-90">
              Apply Leave
            </button>

            <button className="bg-gray-200 py-2 rounded-lg hover:bg-gray-300">
              View Payslip
            </button>

            <button className="bg-gray-200 py-2 rounded-lg hover:bg-gray-300">
              Update Profile
            </button>

          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow p-6">

        <h3 className="text-lg font-semibold text-[#1C225B] mb-4">
          Recent Activity
        </h3>

        <table className="w-full text-left">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">Date</th>
              <th>Status</th>
              <th>Hours</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-2">Jan 20</td>
              <td className="text-green-600">Present</td>
              <td>8h</td>
            </tr>

            <tr className="border-b">
              <td className="py-2">Jan 19</td>
              <td className="text-green-600">Present</td>
              <td>7h 30m</td>
            </tr>

            <tr>
              <td className="py-2">Jan 18</td>
              <td className="text-yellow-600">Leave</td>
              <td>-</td>
            </tr>
          </tbody>

        </table>
      </div>

    </div>
  )
}

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Area */}
      <div className="flex-1">

        <Suspense
          fallback={
            <div className="p-6">
              <h1 className="text-2xl font-bold text-[#1C225B]">
                Dashboard
              </h1>
              <p>Welcome to your employee dashboard.</p>
            </div>
          }
        >
          <EmployeeDashboardClient />
        </Suspense>

      </div>
    </div>
  )
}