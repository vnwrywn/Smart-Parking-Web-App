import api from "../api/axios";

export const logoutUser = async (navigate) => {
  try {
    // Optional backend cookie clearing
    await api.post("/user/logout", {}, { withCredentials: true });
  } catch (err) {
    console.warn("Server logout failed (token probably local):", err.message);
  }

  // Always remove local token
  localStorage.removeItem("token");
  navigate("/login");
};
