import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS } from "@/modules/endpoints";
import { toast } from "sonner";
import privateClient from "@/lib/client/private-client";

export const useMarkLessonDone = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, { lessonId: string }>({
    mutationFn: async ({ lessonId }) => {
      const response = await privateClient.patch(
        ENDPOINTS.STUDENT.MARK_LESSON_DONE(lessonId)
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Lesson marked as done successfully");

      queryClient.invalidateQueries({
        queryKey: ["student-lessons"],
      });
    },
    onError: (error) => {
      return toast.error(error.message || "Something went wrong");
    },
  });

  return mutation;
};
