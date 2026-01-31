import { Suspense } from "react"
import EmployeeDashboardClient from "./EmployeeDashboardClient"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <EmployeeDashboardClient />
    </Suspense>
  )
}
