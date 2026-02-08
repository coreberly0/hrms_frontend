// app/employee/[employeeid]/page.jsx

import EmployeeDashboard from "./EmployeeDashboard";

export default async function EmployeePage({ params }) {
  // ✅ params is ALREADY an object
  const { employeeid } = await params;

  console.log("🔥 SERVER PARAM:", employeeid);

  return <EmployeeDashboard employeeid={employeeid} />;
}
