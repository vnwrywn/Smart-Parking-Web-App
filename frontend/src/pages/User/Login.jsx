import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../../api/axios";

export default function UserLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl font-semibold mb-4">User Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-72">
        <input type="text" name="username" placeholder="Username" onChange={handleChange} className="p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="p-2 border rounded" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
}
