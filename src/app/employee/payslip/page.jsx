"use client"

import Sidebar from "../Sidebar"

export default function PayslipPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <h1 className="text-2xl font-bold text-[#1C225B]">Payslip</h1>
        {/* Your payslip content */}
      </div>
    </div>
  )
}