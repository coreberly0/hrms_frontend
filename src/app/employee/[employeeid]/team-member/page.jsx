// app/employee/[employeeid]/page.jsx

import TeamDashboard from "./TeamDashboard";





export default async function EmployeePage({ params }) {
  // ✅ params is ALREADY an object
  const { employeeid } = await params;

  console.log("🔥 SERVER PARAM:", employeeid);

  return <TeamDashboard employeeid={employeeid} />;
}