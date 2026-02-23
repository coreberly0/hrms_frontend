const API_URL = "https://hrms-backend-0r5r.onrender.com";

const request = async (endpoint) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Request failed");
  return res.json();
};

export const getEmployeeById = (id) =>
  request(`/employees/${id}`);

export const getEmployees = () =>
  request("/employees");