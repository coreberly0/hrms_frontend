const API_URL = "https://hrms-backend-0r5r.onrender.com";

/* ---------------------------------------------
   GENERIC REQUEST FUNCTION
--------------------------------------------- */
const request = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, options);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
};

/* ---------------------------------------------
   GET ALL EMPLOYEES
--------------------------------------------- */
export const getEmployees = () =>
  request("/employees");


/* ---------------------------------------------
   GET EMPLOYEE BY ID
--------------------------------------------- */
export const getEmployeeById = (id) =>
  request(`/employees/${id}`);


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