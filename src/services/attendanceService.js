// ================= BASE CONFIG =================

const API_URL = "https://hrms-backend-0r5r.onrender.com";

const request = async (endpoint, options = {}) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (!token) throw new Error("Token missing");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Request failed");
  }

  return res.json();
};

// ================= ATTENDANCE =================

// ✅ Check In
export const checkIn = () =>
  request("/attendance/checkin", { method: "POST" });

// ✅ Check Out
export const checkOut = () =>
  request("/attendance/checkout", { method: "PUT" });

// ✅ Get Logged-in Employee Attendance
export const getMyAttendance = () =>
  request("/attendance/my");