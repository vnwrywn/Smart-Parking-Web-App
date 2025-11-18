import { Link } from "react-router-dom";
import UserLogoutButton from "../../components/UserLogoutButton";

export default function UserDashboard() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-2xl font-semibold mb-6">User Dashboard</h1>
      <Link to="/user/availability" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6">
        View Availability
      </Link>
      <UserLogoutButton />
    </div>
  );
}
