// services/api.js
const API_URL = "https://hrms-backend-0r5r.onrender.com";

export const loginEmployee = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return res.json();
};

export const getEmployeeById = async (id, token) => {
  const res = await fetch(`${API_URL}/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // send token for protected routes
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch employee data");
  }

  return res.json();
};