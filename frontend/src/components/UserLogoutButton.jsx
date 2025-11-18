import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/logoutUser";

export default function UserLogoutButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => logoutUser(navigate)}
      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
