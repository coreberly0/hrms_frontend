// app/api/chat/search/route.js
const BACKEND_URL = "https://hrms-backend-0r5r.onrender.com";

/**
 * GET /api/chat/search - Search conversations
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const keyword = searchParams.get("keyword");
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!userId || !token) {
      return Response.json(
        { message: "Missing userId or token" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${BACKEND_URL}/chat/search?userId=${userId}&keyword=${encodeURIComponent(keyword || "")}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    return Response.json(data, { status: res.status });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json(
      { message: "Failed to search conversations" },
      { status: 500 }
    );
  }
}
