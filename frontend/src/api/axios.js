import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // your backend base URL

// Default Axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // for admin session cookies
});

// Helper for adding JWT to user requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
