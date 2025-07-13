import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/modules/endpoints";
import type { Student } from "../types";
import privateClient from "@/lib/client/private-client";

export const useGetStudents = () => {
  const query = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await privateClient.get(
        ENDPOINTS.INSTRUCTOR.GET_STUDENTS
      );

      return response.data as Student[];
    },
  });

  return query;
};
