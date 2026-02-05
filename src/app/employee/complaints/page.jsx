"use client"

import Sidebar from "../Sidebar"

export default function ComplaintsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <h1 className="text-2xl font-bold text-[#1C225B]">Complaints</h1>
        {/* Your complaints content */}
      </div>
    </div>
  )
}