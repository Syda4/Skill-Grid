import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  // 1. Agar user logged in nahi hai, toh replace: true ke saath login par bhejo
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Agar user role allowed nahi hai
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // 3. Outlet se sub-routes (AdminLayout, Dashboard) render honge
  return <Outlet />;
};

export default ProtectedRoute;