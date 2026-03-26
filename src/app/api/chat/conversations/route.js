// app/api/chat/conversations/route.js
const BACKEND_URL = "https://hrms-backend-0r5r.onrender.com";

/**
 * GET /api/chat/conversations - Fetch conversations for a user
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!userId || !token) {
      return Response.json(
        { message: "Missing userId or token" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${BACKEND_URL}/chat/conversations?userId=${userId}`,
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
    console.error("Chat conversations error:", error);
    return Response.json(
      { message: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/conversations - Create a new conversation
 */
export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const body = await req.json();

    if (!token) {
      return Response.json(
        { message: "Missing authentication token" },
        { status: 401 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/chat/conversations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return Response.json(data, { status: res.status });
  } catch (error) {
    console.error("Create conversation error:", error);
    return Response.json(
      { message: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
