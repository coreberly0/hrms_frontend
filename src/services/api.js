// services/api.js
const API_URL = "https://hrms-backend-0r5r.onrender.com";

/**
 * Login Employee (FAST + TIMEOUT SAFE)
 */
export const loginEmployee = async (credentials) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Server is slow. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Get Employee by ID (Protected)
 */
export const getEmployeeById = async (id, token) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_URL}/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error("Failed to fetch employee data");
    }

    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timeout. Try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};