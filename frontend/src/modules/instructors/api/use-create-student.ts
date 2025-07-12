import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateStudentRequest, Student } from "../types";
import { ENDPOINTS } from "@/modules/endpoints";
import axios from "axios";
import { toast } from "sonner";

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Student, Error, CreateStudentRequest>({
    mutationFn: async (json) => {
      const response = await axios.post(
        ENDPOINTS.INSTRUCTOR.CREATE_STUDENT,
        json
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Student created successfully");

      queryClient.invalidateQueries({
        queryKey: ["students"],
      });
    },
    onError: (error) => {
      return toast.error(error.message || "Something went wrong");
    },
  });

  return mutation;
};
