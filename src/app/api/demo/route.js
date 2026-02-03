import { NextResponse } from "next/server";

// Fake company data
const companyData = {
  companyId: "1",
  companyName: "TechCorp",
  superadmin: { email: "super@admin.com", password: "1234", role: "superadmin", name: "Super Admin" },
  hrs: [
    { email: "kishorevijay0010@gmail.com", password: "1234", role: "hr", name: "Kishore" },
    { email: "Charannks@gmail.com", password: "1234", role: "hr", name: "Charan" },
  ],
  employees: [
    { email: "emp1@techcorp.com", password: "1234", role: "employee", name: "Dinesh" },
    { email: "emp2@techcorp.com", password: "1234", role: "employee", name: "Reshma" },
  ],
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Superadmin
    if (email === companyData.superadmin.email && password === companyData.superadmin.password) {
      return NextResponse.json({
        ...companyData.superadmin,
        companyId: companyData.companyId,
        companyName: companyData.companyName,
      });
    }

    // HRs
    const hr = companyData.hrs.find(u => u.email === email && u.password === password);
    if (hr) {
      return NextResponse.json({
        ...hr,
        companyId: companyData.companyId,
        companyName: companyData.companyName,
      });
    }

    // Employees
    const emp = companyData.employees.find(u => u.email === email && u.password === password);
    if (emp) {
      return NextResponse.json({
        ...emp,
        companyId: companyData.companyId,
        companyName: companyData.companyName,
      });
    }

    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
