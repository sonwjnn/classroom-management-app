import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/modules/endpoints";
import privateClient from "@/lib/client/private-client";
import type { User } from "../../auth/types";

export const useGetProfile = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await privateClient.get(ENDPOINTS.AUTH.CURRENT_USER);

      return response.data as User;
    },
  });

  return query;
};
