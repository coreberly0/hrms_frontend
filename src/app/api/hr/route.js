import { NextResponse } from "next/server"

const hrs = [
  {
    id: "hr1",
    name: "Kishore",
    email: "kishorevijay0010@gmail.com",
    role: "hr",
  },
  {
    id: "hr2",
    name: "Charan",
    email: "Charannks@gmail.com",
    role: "hr",
  },
  {
    id: "hr3",
    name: "Reshma",
    email: "reshmashanmugam1234@gmail.com",
    role: "hr",
  },
]

export async function GET() {
  return NextResponse.json(hrs)
}
