const API_URL = "https://hrms-backend-0r5r.onrender.com";

const request = async (endpoint, options = {}) => {
  const token = typeof window !== "undefined"
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
    throw new Error(err.error || "Request failed");
  }

  return res.json();
};

// ================= PROJECTS =================

export const getProjectsByEmployee = (employeeId) =>
  request(`/projects/employee/${employeeId}`);

export const getAllProjects = () =>
  request("/projects");

export const createProject = (data) =>
  request("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateProject = (id, data) =>
  request(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteProject = (id) =>
  request(`/projects/${id}`, {
    method: "DELETE",
  });

// ================= ASSIGN =================

export const assignEmployeeToProject = (data) =>
  request("/projects/assign", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const removeEmployeeFromProject = (projectId, employeeId) =>
  request(`/projects/${projectId}/employee/${employeeId}`, {
    method: "DELETE",
  });