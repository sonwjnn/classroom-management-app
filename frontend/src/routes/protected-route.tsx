import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem("phone");

  const location = useLocation();

  if (isAuthenticated) {
    return <Outlet />;
  }
  if (!isAuthenticated) {
    return <Navigate to={`/auth/login`} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
