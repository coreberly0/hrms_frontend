// app/employee/[employeeid]/page.jsx

import EmployeeProfileDashboard from "./EmployeeProfileDashboard";

export default async function Page({ params }) {
  // ✅ params is ALREADY an object
  const { employeeid } = await params;

  console.log("🔥 SERVER PARAM:", employeeid);

  return <EmployeeProfileDashboard employeeid={employeeid} />;
}
