import { Suspense } from "react"
import HrDashboardPage from "./HrDashboardClient"


export default function Page() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <HrDashboardPage />
    </Suspense>
  )
}
