'use client'

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EmployeeDashboardClient() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get("companyId")
  const companyName = searchParams.get("companyName")

  // start with null to avoid SSR mismatch
  const [currentTime, setCurrentTime] = useState(null)

  useEffect(() => {
    // update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Sample announcements
  const announcements = [
    { id: 1, message: "Team meeting tomorrow at 10 AM" },
    { id: 2, message: "Holiday on Friday (Festival)" },
    { id: 3, message: "Submit monthly report by 28th" }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1C225B]">
            Employee Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {companyName} (ID: {companyId})
          </p>
        </div>

        {/* Live Date & Time */}
        <div className="text-right">
          {currentTime ? (
            <>
              <p className="text-gray-700 font-medium">
                {currentTime.toLocaleDateString()}
              </p>
              <p className="text-xl font-semibold text-[#1C225B]">
                {currentTime.toLocaleTimeString()}
              </p>
            </>
          ) : (
            <p className="text-gray-700 font-medium">Loading...</p>
          )}
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Today's Status</p>
          <h2 className="text-xl font-semibold text-green-600">Present</h2>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Working Hours</p>
          <h2 className="text-xl font-semibold">7h 45m</h2>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Leave Balance</p>
          <h2 className="text-xl font-semibold">12 Days</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Announcements */}
        <div className="bg-white p-5 rounded-xl shadow md:col-span-2">
          <h3 className="text-lg font-semibold text-[#1C225B] mb-3">
            Company Announcements
          </h3>
          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements yet</p>
          ) : (
            <ul className="space-y-3 text-gray-700">
              {announcements.map(item => (
                <li key={item.id}>📢 {item.message}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-[#1C225B] mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
            <button className="bg-[#1C225B] text-white py-2 rounded hover:bg-[#2c326d]">
              Mark Attendance
            </button>
            <button className="bg-[#394392] text-white py-2 rounded hover:opacity-90">
              Apply Leave
            </button>
            <button className="bg-gray-200 py-2 rounded hover:bg-gray-300">
              View Payslip
            </button>
            <button className="bg-gray-200 py-2 rounded hover:bg-gray-300">
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-[#1C225B] mb-3">
          Recent Activity
        </h3>
        <table className="w-full">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2 text-left">Date</th>
              <th className="text-left">Status</th>
              <th className="text-left">Hours</th>
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











