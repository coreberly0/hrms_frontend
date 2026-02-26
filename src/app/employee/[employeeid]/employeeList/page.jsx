// app/employee/[employeeid]/page.jsx

import EmployeeListDashboard from "./EmployeeListDashboard";

export default async function EmployeePage({ params }) {
  // ✅ params is ALREADY an object
  const { employeeid } = await params;

  console.log("🔥 SERVER PARAM:", employeeid);

  return <EmployeeListDashboard employeeid={employeeid} />;
}
