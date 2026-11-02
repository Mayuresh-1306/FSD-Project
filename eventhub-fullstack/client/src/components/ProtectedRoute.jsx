import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Loading from "./Loading.jsx";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <Loading message="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (requireAdmin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
