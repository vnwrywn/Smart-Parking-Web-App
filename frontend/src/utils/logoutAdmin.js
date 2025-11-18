// src/utils/logoutAdmin.js
import api from "../api/axios";

export const logoutAdmin = async (navigate) => {
  try {
    await api.post("/admin/logout", {}, { withCredentials: true });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    // Always redirect to login page
    navigate("/admin/login");
  }
};
