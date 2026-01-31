import { NextResponse } from "next/server"

const hrs = [
  { id: "hr1", name: "Kishore", email: "kishorevijay0010@gmail.com" },
  { id: "hr2", name: "Charan", email: "Charannks@gmail.com" },
  { id: "hr3", name: "Reshma", email: "reshmashanmugam1234@gmail.com" },
]

export async function GET(req, { params }) {
  const hr = hrs.find(h => h.id === params.id)

  if (!hr) {
    return NextResponse.json(
      { message: "HR not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(hr)
}
