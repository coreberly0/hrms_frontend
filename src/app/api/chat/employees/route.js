// app/api/chat/employees/route.js
const BACKEND_URL = "https://hrms-backend-0r5r.onrender.com";

/**
 * GET /api/chat/employees - Get list of employees for chat
 */
export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return Response.json(
        { message: "Missing authentication token" },
        { status: 401 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/chat/employees`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    return Response.json(data, { status: res.status });
  } catch (error) {
    console.error("Fetch employees error:", error);
    return Response.json(
      { message: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}
