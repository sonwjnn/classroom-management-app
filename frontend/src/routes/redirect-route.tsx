import { useCurrentRole } from "@/modules/auth/api/use-current-role";
import { Navigate } from "react-router-dom";

export default function RedirectRoute() {
  const { data, isLoading } = useCurrentRole({
    phone: localStorage.getItem("phone")!,
  });

  if (isLoading) return <div>Loading...</div>;

  if (data?.role === "student") {
    return <Navigate to="/students" replace />;
  }

  if (data?.role === "instructor") {
    return <Navigate to="/instructors" replace />;
  }

  return <Navigate to="/auth/login" />;
}
