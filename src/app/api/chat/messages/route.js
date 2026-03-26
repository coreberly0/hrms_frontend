// app/api/chat/messages/route.js
const BACKEND_URL = "https://hrms-backend-0r5r.onrender.com";

/**
 * GET /api/chat/messages - Fetch messages for a conversation
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!conversationId || !token) {
      return Response.json(
        { message: "Missing conversationId or token" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${BACKEND_URL}/chat/messages?conversationId=${conversationId}`,
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
    console.error("Fetch messages error:", error);
    return Response.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/messages - Send a new message
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

    const res = await fetch(`${BACKEND_URL}/chat/messages`, {
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
    console.error("Send message error:", error);
    return Response.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}
