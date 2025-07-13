import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateStudentRequest, Student } from "../types";
import { ENDPOINTS } from "@/modules/endpoints";
import { toast } from "sonner";
import privateClient from "@/lib/client/private-client";

export const useEditStudent = ({ phone }: { phone: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Student, Error, UpdateStudentRequest>({
    mutationFn: async (json) => {
      const response = await privateClient.patch(
        ENDPOINTS.INSTRUCTOR.UPDATE_STUDENT(phone),
        json
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Student updated successfully");

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
