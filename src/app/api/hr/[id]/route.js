import { NextResponse } from "next/server";

const hrs = [
  { id: "hr1", name: "Kishore V", email: "kishorevijay0010@gmail.com", role: "HR Manager", companyId: "1", companyName: "Corberly", status: "Active" },
  { id: "hr2", name: "Charan", email: "Charannks@gmail.com", role: "HR Executive", companyId: "1", companyName: "Corberly", status: "Active" },
  { id: "hr3", name: "Reshma", email: "reshmashanmugam1234@gmail.com", role: "HR Recruiter", companyId: "1", companyName: "Corberly", status: "Inactive" },
  { id: "hr4", name: "Kani", email: "kanigskanigs362@gmail.com", role: "HR Payroll", companyId: "1", companyName: "Corberly", status: "Inactive" },
];

export async function GET(request, context) {
  // ✅ params is async in Next 15+
  const { id } = await context.params;

  console.log("HR API called with id:", id);

  const hr = hrs.find(h => h.id === id);

  if (!hr) {
    return NextResponse.json(
      { message: "HR not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(hr);
}
