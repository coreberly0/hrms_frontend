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
    const timeout = setTimeout(() => controller.abort(), 10000);

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

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Session expired");
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
/* ======================= TEAMS ======================= */
/* ===================================================== */

/* GET ALL TEAMS */
export const getTeams = () => request("/teams");


/* CREATE TEAM */
export const createTeam = (data) =>
  request("/teams", {
    method: "POST",
    body: JSON.stringify(data)
  });


/* UPDATE TEAM */
export const updateTeam = (id, data) =>
  request(`/teams/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });


/* DELETE TEAM */
export const deleteTeam = (id) =>
  request(`/teams/${id}`, {
    method: "DELETE"
  });


/* ===================================================== */
/* ==================== TEAM MEMBERS =================== */
/* ===================================================== */

/* GET TEAM MEMBERS */
export const getTeamMembers = (teamId) =>
  request(`/teams/${teamId}/members`);


/* ADD / TRANSFER EMPLOYEE */
export const addTeamMember = (data) =>
  request("/teams/members", {
    method: "POST",
    body: JSON.stringify(data)
  });


/* REMOVE EMPLOYEE FROM TEAM */
export const removeTeamMember = (id) =>
  request(`/teams/members/${id}/remove`, {
    method: "PUT"
  });