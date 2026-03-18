const API_URL = "https://hrms-backend-0r5r.onrender.com";

/* ---------------------------------------------
   GENERIC REQUEST FUNCTION (FIXED)
--------------------------------------------- */
const request = async (endpoint, method = "GET", body = null) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data.message || `API Error: ${res.status} ${res.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error.message);
    throw error; // ✅ IMPORTANT (no return null)
  }
};

/* ---------------------------------------------
   NORMALIZE EMPLOYEE DATA
--------------------------------------------- */
const normalizeEmployee = (payload) => {
  let raw = payload;

  if (Array.isArray(raw)) raw = raw[0];

  if (raw && typeof raw === "object") {
    if (raw.employee) raw = raw.employee;
    if (raw.data) raw = raw.data;
  }

  if (!raw || typeof raw !== "object") return raw;

  const normalized = { ...raw };

  if (!normalized.name && raw.employeeName) normalized.name = raw.employeeName;
  if (!normalized.employee_id && raw.employeeCode)
    normalized.employee_id = raw.employeeCode;
  if (!normalized.position && raw.designation)
    normalized.position = raw.designation;
  if (!normalized.position && raw.role)
    normalized.position = raw.role;
  if (!normalized.role && raw.role) normalized.role = raw.role;
  if (!normalized.role && raw.position) normalized.role = raw.position;
  if (!normalized.department && raw.department)
    normalized.department = raw.department;
  if (!normalized.email && raw.email) normalized.email = raw.email;
  if (!normalized.profile_image && raw.profileImage)
    normalized.profile_image = raw.profileImage;

  return normalized;
};

/* ---------------------------------------------
   GET ALL EMPLOYEES
--------------------------------------------- */
export const getEmployees = async () => {
  return await request("/employees");
};

/* ---------------------------------------------
   GET EMPLOYEE BY ID
--------------------------------------------- */
export const getEmployeeById = async (id) => {
  const data = await request(`/employees/${id}`);
  return normalizeEmployee(data);
};

/* ---------------------------------------------
   ADD EMPLOYEE
--------------------------------------------- */
export const addEmployee = (data) =>
  request("/employees", "POST", data);

/* ---------------------------------------------
   UPDATE EMPLOYEE
--------------------------------------------- */
export const updateEmployee = (id, data) =>
  request(`/employees/${id}`, "PUT", data);

/* ---------------------------------------------
   DELETE EMPLOYEE
--------------------------------------------- */
export const deleteEmployee = (id) =>
  request(`/employees/${id}`, "DELETE");