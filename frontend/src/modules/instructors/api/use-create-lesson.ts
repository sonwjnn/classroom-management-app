import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateLessonRequest, Lesson } from "../types";
import { ENDPOINTS } from "@/modules/endpoints";
import { toast } from "sonner";
import privateClient from "@/lib/client/private-client";

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Lesson, Error, CreateLessonRequest>({
    mutationFn: async (json) => {
      const response = await privateClient.post(
        ENDPOINTS.INSTRUCTOR.CREATE_LESSON,
        json
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Lesson created successfully");

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
