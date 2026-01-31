import { NextResponse } from "next/server"

const employees = [
  {
    id: "emp1",
    name: "Employee One",
    email: "emp1@techcorp.com",
    department: "Engineering",
  },
  {
    id: "emp2",
    name: "Employee Two",
    email: "emp2@techcorp.com",
    department: "HR",
  },
  {
    id: "emp3",
    name: "Kanigs",
    email: "kanigskanigs362@gmail.com",
    department: "Finance",
  },
]

export async function GET() {
  return NextResponse.json(employees)
}
