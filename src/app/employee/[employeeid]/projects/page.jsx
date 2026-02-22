
import EmployeeProjects from "./ProjectDashboard";

export default async function EmployeeProjectPage({ params }) {
  // ✅ params is ALREADY an object
  const { employeeid } = await params;

  console.log("🔥 SERVER PARAM:", employeeid);

  return <EmployeeProjects employeeid={employeeid} />;
}
