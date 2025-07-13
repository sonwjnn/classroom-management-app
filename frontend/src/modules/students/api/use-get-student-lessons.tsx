import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/modules/endpoints";
import type { Lesson } from "../types";
import privateClient from "@/lib/client/private-client";

export const useGetStudentLessons = () => {
  const query = useQuery({
    queryKey: ["student-lessons"],
    queryFn: async () => {
      const response = await privateClient.get(ENDPOINTS.STUDENT.GET_LESSONS);

      return response.data as Lesson[];
    },
  });

  return query;
};
