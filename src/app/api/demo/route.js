import { NextResponse } from "next/server";

const companyData = {
  companyId: "1",
  companyName: "TechCorp",
  superadmin: {
    id: "super1",
    email: "super@admin.com",
    password: "1234",
    role: "superadmin",
    name: "Super Admin",
  },
  hrs: [
    {
      id: "hr1",
      email: "",
      password: "1234",
      role: "hr",
      name: "Kishore V",
    },
    {
      id: "hr2",
      email: "Charannks@gmail.com",
      password: "1234",
      role: "hr",
      name: "Charan",
    },
    {
      id: "hr3",
      email: "reshmashanmugam12344@gmail.com",
      password: "1234",
      role: "hr",
      name: "Reshma",
    },
    {
      id: "hr4",
      email: "kanigskanigs3622@gmail.com",
      password: "1234",
      role: "hr",
      name: "Kani",
    },
  ],
  employees: [
    {
      id: "emp1",
      email: "kishorevijay0010@gmail.com",
      password: "1234",
      role: "employee",
      name: "Dinesh",
    },
    {
      id: "emp2",
      email: "reshmashanmugam1234@gmail.com",
      password: "1234",
      role: "employee",
      name: "Reshma",
    },
     {
      id: "emp3",
      email: "kanigskanigs362@gmail.com",
      password: "1234",
      role: "employee",
      name: "Kani",
    },
  ],
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Superadmin
    if (
      email === companyData.superadmin.email &&
      password === companyData.superadmin.password
    ) {
      return NextResponse.json({
        ...companyData.superadmin,
        companyId: companyData.companyId,
        companyName: companyData.companyName,
      });
    }

    // HR
    const hr = companyData.hrs.find(
      (u) => u.email === email && u.password === password,
    );
    if (hr) {
      return NextResponse.json({
        ...hr,
        companyId: companyData.companyId,
        companyName: companyData.companyName,
      });
    }

    // Employee
    const emp = companyData.employees.find(
      (u) => u.email === email && u.password === password,
    );
    if (emp) {
      return NextResponse.json({
        ...emp,
        companyId: companyData.companyId,
        companyName: companyData.companyName,
      });
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
