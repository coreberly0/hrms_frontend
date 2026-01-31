import { NextResponse } from "next/server"

// Fake single company data with multiple HRs and employees
const companyData = {
  companyId: "1",
  companyName: "TechCorp",
  superadmin: { email: "super@admin.com", password: "1234", role: "superadmin" },
  hrs: [
    { email: "kishorevijay0010@gmail.com", password: "1234", role: "hr" },
    { email: "Charannks@gmail.com", password: "1234", role: "hr" },
    
  ],
  employees: [
    { email: "emp1@techcorp.com", password: "1234", role: "employee" },
    { email: "emp2@techcorp.com", password: "1234", role: "employee" },
    { email: "kanigskanigs362@gmail.com", password: "1234", role: "employee" },
    { email: "reshmashanmugam1234@gmail.com", password: "1234", role: "employee" },
  ],
}

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    // 1️⃣ Check Superadmin
    if (email === companyData.superadmin.email && password === companyData.superadmin.password) {
      return NextResponse.json({
        email: email,
        role: "superadmin",
        companyId: companyData.companyId,
        companyName: companyData.companyName,
      })
    }

    // 2️⃣ Check HRs
    const hr = companyData.hrs.find(u => u.email === email && u.password === password)
    if (hr) {
      return NextResponse.json({
        ...hr,
        companyId: companyData.companyId,
        companyName: companyData.companyName,
      })
    }

    // 3️⃣ Check Employees
    const emp = companyData.employees.find(u => u.email === email && u.password === password)
    if (emp) {
      return NextResponse.json({
        ...emp,
        companyId: companyData.companyId,
        companyName: companyData.companyName,
      })
    }

    // 4️⃣ Invalid credentials
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
