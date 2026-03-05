// app/employee/[employeeid]/page.jsx

import AttendanceDashboard from "./AttendanceDashboard";



export default async function EmployeePage({ params }) {
  // ✅ params is ALREADY an object
  const { employeeid } = await params;

  console.log("🔥 SERVER PARAM:", employeeid);

  return <AttendanceDashboard employeeid={employeeid} />;
}
