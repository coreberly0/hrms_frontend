import { Suspense } from "react"
import EmployeeDashboardClient from "./EmployeeDashboardClient"

export default function Page() {
  return (
    <Suspense fallback={<div><h1 style={{ color: '#1C225B' }}>Dashboard</h1>
      <p>Welcome to your employee dashboard.</p></div>}>
      <EmployeeDashboardClient />
    </Suspense>
  )
}
