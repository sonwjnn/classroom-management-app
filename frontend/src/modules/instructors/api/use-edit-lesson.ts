import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateLessonRequest, Student } from "../types";
import { ENDPOINTS } from "@/modules/endpoints";
import { toast } from "sonner";
import privateClient from "@/lib/client/private-client";

export const useEditLesson = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Student, Error, UpdateLessonRequest>({
    mutationFn: async (json) => {
      const response = await privateClient.patch(
        ENDPOINTS.INSTRUCTOR.UPDATE_LESSON(id),
        json
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Lesson updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["instructor-lessons"],
      });
    },
    onError: (error) => {
      return toast.error(error.message || "Something went wrong");
    },
  });

  return mutation;
};
