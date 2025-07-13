import { useCurrentRole } from "@/modules/auth/api/use-current-role";
import { Navigate } from "react-router-dom";

export default function RedirectRoute() {
  useCurrentRole();

  return <Navigate to="/auth/login" />;
}
