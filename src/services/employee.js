const API_URL = "https://hrms-backend-0r5r.onrender.com";

// ✅ Get all employees
export const getEmployees = async (token) => {
  try {
    const res = await fetch(`${API_URL}/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch employees");
    return await res.json();
  } catch (err) {
    console.error("Error fetching employees:", err);
    throw err;
  }
};

// ✅ Get single employee by ID
export const getEmployeeById = async (id, token) => {
  const res = await fetch(`${API_URL}/employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch employee");
  return res.json();
};