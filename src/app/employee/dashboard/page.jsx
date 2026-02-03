import { Suspense } from "react"
import Sidebar from "./Sidebar"
import EmployeeDashboardClient from "./EmployeeDashboardClient"

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