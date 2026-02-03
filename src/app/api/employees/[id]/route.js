export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const companyId = searchParams.get("companyId")

  return NextResponse.json([
    { id: "e1", name: "Arun", companyId },
  ])
}
