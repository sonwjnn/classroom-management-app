import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const isAuthenticated = !!localStorage.getItem("phone");

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
}
