import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/modules/endpoints";
import axios from "axios";

export const useCurrentRole = ({ phone }: { phone: string }) => {
  const query = useQuery({
    enabled: !!phone,
    queryKey: ["current-role", phone],
    queryFn: async () => {
      const response = await axios.get(ENDPOINTS.AUTH.CURRENT_ROLE, {
        params: {
          phone,
        },
      });

      return response.data as { role: "student" | "instructor" };
    },
  });

  return query;
};
