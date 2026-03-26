// app/api/chat/upload/route.js
const BACKEND_URL = "https://hrms-backend-0r5r.onrender.com";

/**
 * POST /api/chat/upload - Upload attachment/image for chat
 */
export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return Response.json(
        { message: "Missing authentication token" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const res = await fetch(`${BACKEND_URL}/chat/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    return Response.json(data, { status: res.status });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { message: "Failed to upload attachment" },
      { status: 500 }
    );
  }
}
