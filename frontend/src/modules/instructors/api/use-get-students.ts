import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ENDPOINTS } from "@/modules/endpoints";
import type { Student } from "../types";

export const useGetStudents = () => {
  const query = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await axios.get(ENDPOINTS.INSTRUCTOR.GET_STUDENTS, {
        params: {
          phone: localStorage.getItem("phone")!,
        },
      });

      return response.data as Student[];
    },
  });

  return query;
};
