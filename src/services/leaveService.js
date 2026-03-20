const API_URL = "https://hrms-backend-0r5r.onrender.com";

/* ================= COMMON REQUEST FUNCTION ================= */

const request = async (endpoint, options = {}) => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      throw new Error("Token missing. Please login again.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    clearTimeout(timeout);

    let data = {};

    try {
      data = await res.json();
    } catch {
      data = {};
    }

    // 🔴 Auto logout if token expired
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    if (!res.ok) {
      throw new Error(data.error || data.message || "Request failed");
    }

    return data;

  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};


/* ===================================================== */
/* ==================== LEAVE TYPES ==================== */
/* ===================================================== */

export const getLeaveTypes = () => request("/leave/types");


/* ===================================================== */
/* =================== LEAVE BALANCE =================== */
/* ===================================================== */

export const getLeaveBalance = () => request("/leave/balance");

export const addLeaveBalance = (data) =>
  request("/leave/add-balance", {
    method: "POST",
    body: JSON.stringify(data)
  });

export const updateLeaveBalance = (data) =>
  request("/leave/update-balance", {
    method: "PUT",
    body: JSON.stringify(data)
  });


/* ===================================================== */
/* ===================== APPLY LEAVE =================== */
/* ===================================================== */

export const applyLeave = (data) =>
  request("/leave/apply", {
    method: "POST",
    body: JSON.stringify(data)
  });


/* ===================================================== */
/* ================= EMPLOYEE LEAVE LIST =============== */
/* ===================================================== */

export const getMyLeaves = () => request("/leave/my-leaves");


/* ===================================================== */
/* ================= MANAGER / HR ====================== */
/* ===================================================== */

export const getAllLeaves = () => request("/leave/all");

export const approveLeave = (leaveId) =>
  request(`/leave/approve/${leaveId}`, {
    method: "PUT"
  });

export const rejectLeave = (leaveId) =>
  request(`/leave/reject/${leaveId}`, {
    method: "PUT"
  });