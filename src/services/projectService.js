const API_URL = "https://hrms-backend-0r5r.onrender.com";

/* ================================
   🔹 Helper Function
================================ */
const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};

const getAuthHeader = (token) => {
  if (!token) {
    throw new Error("Authentication token missing");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* ================================
   🔹 Get All Projects
================================ */
export const getProjects = async (token) => {
  try {
    const res = await fetch(`${API_URL}/projects`, {
      headers: {
        ...getAuthHeader(token),
      },
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    throw err;
  }
};

/* ================================
   🔹 Get Project By ID
================================ */
export const getProjectById = async (id, token) => {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      headers: {
        ...getAuthHeader(token),
      },
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error fetching project:", err.message);
    throw err;
  }
};

/* ================================
   🔹 Create Project
================================ */
export const createProject = async (projectData, token) => {
  try {
    const res = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(token),
      },
      body: JSON.stringify(projectData),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error creating project:", err.message);
    throw err;
  }
};

/* ================================
   🔹 Update Project
================================ */
export const updateProject = async (id, projectData, token) => {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(token),
      },
      body: JSON.stringify(projectData),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error updating project:", err.message);
    throw err;
  }
};

/* ================================
   🔹 Delete Project
================================ */
export const deleteProject = async (id, token) => {
  try {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(token),
      },
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error deleting project:", err.message);
    throw err;
  }
};

/* ================================
   🔹 Assign Employee To Project
================================ */
export const assignEmployeeToProject = async (data, token) => {
  try {
    const res = await fetch(`${API_URL}/projects/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(token),
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error assigning employee:", err.message);
    throw err;
  }
};

/* ================================
   🔹 Get Projects By Employee ID
================================ */
export const getProjectsByEmployee = async (employeeId, token) => {
  try {
    const res = await fetch(
      `${API_URL}/projects/employee/${employeeId}`,
      {
        headers: {
          ...getAuthHeader(token),
        },
      }
    );

    return await handleResponse(res);
  } catch (err) {
    console.error("Error fetching employee projects:", err.message);
    throw err;
  }
};