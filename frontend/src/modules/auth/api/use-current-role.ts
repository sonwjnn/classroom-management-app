import { ENDPOINTS } from "@/modules/endpoints";
import privateClient from "@/lib/client/private-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useCurrentRole = () => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  useEffect(() => {
    async function getCurrentRole() {
      const response = await privateClient.get(ENDPOINTS.AUTH.CURRENT_ROLE);

      if (response.data?.role === "student") {
        if (pathname.startsWith("/students")) {
          return;
        }
        navigate("/students");
      }

      if (response.data?.role === "instructor") {
        if (pathname.startsWith("/instructors")) {
          return;
        }
        navigate("/instructors");
      }
    }

    getCurrentRole();
  }, []);
};
