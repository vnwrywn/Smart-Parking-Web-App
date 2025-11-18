import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../utils/logoutAdmin";

export default function AdminLogoutButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => logoutAdmin(navigate)}
      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
