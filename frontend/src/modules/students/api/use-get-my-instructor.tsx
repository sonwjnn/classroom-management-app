import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/modules/endpoints";
import privateClient from "@/lib/client/private-client";
import type { User } from "../../auth/types";

export const useGetMyInstructor = () => {
  const query = useQuery({
    queryKey: ["my-instructor"],
    queryFn: async () => {
      const response = await privateClient.get(
        ENDPOINTS.STUDENT.GET_MY_INSTRUCTOR
      );

      return response.data as User;
    },
  });

  return query;
};
