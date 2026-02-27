import { NextResponse } from "next/server";

const employeeLogs = [
  {
    id: "8",
    employeeCode: "EMP-00001",
    employeeName: "Kishore",
    gender: "Male",
    maritalStatus: "Married",
    personalPhone: "9876543210",
    alternatePhone: "9123456789",
    email: "kishore@corberly.com",
    address: {
      doorNo: "12A",
      street: "MG Road",
      area: "T Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
    },
    department: "IT",
    designation: "Developer",
    role: "developer",
    salary: 35000,
    companyId: "1",
    companyName: "Corberly",
    joiningDate: "2024-06-15",
    date: "2026-02-27",
    loginTime: "09:10 AM",
    logoutTime: "06:05 PM",
    status: "Present",
  },

  {
    id: "9",
    employeeCode: "EMP-00002",
    employeeName: "Kani",
    gender: "Female",
    maritalStatus: "UnMarried",
    personalPhone: "9876543210",
    alternatePhone: "9123456789",
    email: "kani@corberly.com",
    address: {
      doorNo: "12A",
      street: "MG Road",
      area: "T Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
    },
    department: "HR",
    designation: "HR Executive",
    role: "hr",
    salary: 32000,
    companyId: "1",
    companyName: "Corberly",
    joiningDate: "2024-09-15",
    date: "2026-02-27",
    loginTime: "09:20 AM",
    logoutTime: "06:00 PM",
    status: "Present",
  },

  {
    id: "10",
    employeeCode: "EMP-00003",
    employeeName: "Reshma",
    gender: "Female",
    maritalStatus: "UnMarried",
    personalPhone: "9876543210",
    alternatePhone: "9123456789",
    email: "reshma@corberly.com",
    address: {
      doorNo: "7B",
      street: "Anna Nagar West",
      area: "Anna Nagar",
      city: "Madurai",
      state: "Tamil Nadu",
      pincode: "625020",
    },
    department: "HR",
    designation: "Manager",
    role: "manager",
    salary: 38000,
    companyId: "1",
    companyName: "Corberly",
    joiningDate: "2024-03-15",
    date: "2026-02-27",
    loginTime: "09:15 AM",
    logoutTime: "06:10 PM",
    status: "Present",
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