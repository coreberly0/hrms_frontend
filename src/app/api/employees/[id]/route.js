import { NextResponse } from "next/server";

const employeeLogs = [
  {
    // 🔑 AUTH / ROUTING
    id: "emp1",

    // 🪪 EMPLOYEE INFO
    employeeCode: "EMP-39394",
    employeeName: "Arun Kumar",
    gender: "Male",
    maritalStatus: "Married",

    // 📞 CONTACT DETAILS
    personalPhone: "9876543210",
    alternatePhone: "9123456789",
    email: "arun.kumar@techcorp.com",

    // 🏠 ADDRESS
    address: {
      doorNo: "12A",
      street: "MG Road",
      area: "T Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
    },

    // 🏢 COMPANY DETAILS
    department: "Engineering",
    designation: "Software Engineer",
    role: "employee",
    salary: 35000,
    companyId: "1",
    companyName: "TechCorp",
    joiningDate: "2024-06-15",

    // 📅 ATTENDANCE
    date: "2026-02-05",
    loginTime: "09:10 AM",
    logoutTime: "06:05 PM",
    status: "Present",
  },

  {
    id: "emp1",
    employeeCode: "EMP-39394",
    employeeName: "Arun Kumar",
    gender: "Male",
    maritalStatus: "Married",

    personalPhone: "9876543210",
    alternatePhone: "9123456789",
    email: "arun.kumar@techcorp.com",

    address: {
      doorNo: "12A",
      street: "MG Road",
      area: "T Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
    },

    department: "Engineering",
    designation: "Software Engineer",
    role: "employee",
    salary: 35000,
    companyId: "1",
    companyName: "TechCorp",
    joiningDate: "2024-06-15",

    date: "2026-02-04",
    loginTime: "09:20 AM",
    logoutTime: "06:00 PM",
    status: "Present",
  },

  // 👇 Another employee
  {
    id: "emp2",
    employeeCode: "EMP-40211",
    employeeName: "Bala Murugan",
    gender: "Male",
    maritalStatus: "Single",

    personalPhone: "9000012345",
    alternatePhone: "9000098765",
    email: "bala.murugan@techcorp.com",

    address: {
      doorNo: "7B",
      street: "Anna Nagar West",
      area: "Anna Nagar",
      city: "Madurai",
      state: "Tamil Nadu",
      pincode: "625020",
    },

    department: "QA",
    designation: "QA Engineer",
    role: "employee",
    salary: 28000,
    companyId: "1",
    companyName: "TechCorp",
    joiningDate: "2025-01-10",

    date: "2026-02-05",
    loginTime: null,
    logoutTime: null,
    status: "Absent",
  },
];

export async function GET(request, { params }) {
  const { id } = await params;

  console.log("Employee Logs API called for:", id);

  const logs = employeeLogs.filter(log => log.id === id);

  if (logs.length === 0) {
    return NextResponse.json(
      { message: "No logs found" },
      { status: 404 }
    );
  }

  return NextResponse.json(logs);
}
