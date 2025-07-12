import { Navigate, Outlet, useLocation } from "react-router-dom";

const publicPaths = ["/login", "/register"];

export default function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem("phone");

  const location = useLocation();

  const isPublicPath = publicPaths.some((path) => {
    const pathRegex = new RegExp(`^${path.replace(/:[^\s/]+/g, "[^/]+")}$`);
    return pathRegex.test(location.pathname);
  });

  if (isPublicPath || isAuthenticated) {
    return <Outlet />;
  }
  if (!isAuthenticated) {
    return <Navigate to={`/login`} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
