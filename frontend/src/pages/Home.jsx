import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-bold mb-6">SmartPark</h1>
      <p className="mb-8 text-lg text-gray-600">Smart parking management system</p>
      <div className="space-x-4">
        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded">User Login</Link>
        <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded">User Register</Link>
        <Link to="/admin/login" className="px-4 py-2 bg-gray-700 text-white rounded">Admin Login</Link>
      </div>
    </div>
  );
}
