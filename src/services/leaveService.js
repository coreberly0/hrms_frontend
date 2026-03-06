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

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    let data = {};

    try {
      data = await res.json();
    } catch (err) {
      data = {};
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

// GET /leave/types
export const getLeaveTypes = async () => {
  return request("/leave/types");
};



/* ===================================================== */
/* =================== LEAVE BALANCE =================== */
/* ===================================================== */

// GET /leave/balance
export const getLeaveBalance = async () => {
  return request("/leave/balance");
};


// POST /leave/add-balance
export const addLeaveBalance = async (data) => {
  return request("/leave/add-balance", {
    method: "POST",
    body: JSON.stringify(data)
  });
};


// PUT /leave/update-balance
export const updateLeaveBalance = async (data) => {
  return request("/leave/update-balance", {
    method: "PUT",
    body: JSON.stringify(data)
  });
};



/* ===================================================== */
/* ===================== APPLY LEAVE =================== */
/* ===================================================== */

// POST /leave/apply
export const applyLeave = async (data) => {
  return request("/leave/apply", {
    method: "POST",
    body: JSON.stringify(data)
  });
};



/* ===================================================== */
/* ================= EMPLOYEE LEAVE LIST =============== */
/* ===================================================== */

// GET /leave/my-leaves
export const getMyLeaves = async () => {
  return request("/leave/my-leaves");
};



/* ===================================================== */
/* ================= MANAGER / HR ====================== */
/* ===================================================== */

// GET /leave/all
export const getAllLeaves = async () => {
  return request("/leave/all");
};


// PUT /leave/approve/:id
export const approveLeave = async (leaveId) => {
  return request(`/leave/approve/${leaveId}`, {
    method: "PUT"
  });
};


// PUT /leave/reject/:id
export const rejectLeave = async (leaveId) => {
  return request(`/leave/reject/${leaveId}`, {
    method: "PUT"
  });
};