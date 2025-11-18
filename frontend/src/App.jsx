import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserLogin from "./pages/User/Login";
import UserRegister from "./pages/User/Register";
import UserDashboard from "./pages/User/Dashboard";
import UserViewAvailability from "./pages/User/ViewAvailability";
import UserLotDetail from "./pages/User/LotDetail";
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminViewAvailability from "./pages/Admin/ViewAvailability";
import AdminLotDetail from "./pages/Admin/LotDetail";
import BuildingForm from "./pages/Admin/BuildingForm";
import LotForm from "./pages/Admin/LotForm";
import NotFound from "./pages/NotFound";
  
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/availability" element={<UserViewAvailability />} />
        <Route path="/user/lot/:id" element={<UserLotDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/availability" element={<AdminViewAvailability />} />
        <Route path="/admin/lot/:id" element={<AdminLotDetail />} />
        <Route path="/admin/building/create" element={<BuildingForm />} />
        <Route path="/admin/building/edit/:id" element={<BuildingForm />} />
        <Route path="/admin/lot/create" element={<LotForm />} />
        <Route path="/admin/lot/edit/:id" element={<LotForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
