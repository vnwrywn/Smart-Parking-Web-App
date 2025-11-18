import { Link } from "react-router-dom";
import AdminLogoutButton from "../../components/AdminLogoutButton";


export default function AdminDashboard() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <Link to="/admin/availability" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 mb-6">
        View Availability
      </Link>
      <AdminLogoutButton />
    </div>
  );
}
