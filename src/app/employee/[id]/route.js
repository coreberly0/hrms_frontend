import { NextResponse } from "next/server"

const employees = [
  { id: "emp1", name: "Employee One", email: "emp1@techcorp.com" },
  { id: "emp2", name: "Employee Two", email: "emp2@techcorp.com" },
  { id: "emp3", name: "Kanigs", email: "kanigskanigs362@gmail.com" },
]

export async function GET(req, { params }) {
  const employee = employees.find(e => e.id === params.id)

  if (!employee) {
    return NextResponse.json(
      { message: "Employee not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(employee)
}
