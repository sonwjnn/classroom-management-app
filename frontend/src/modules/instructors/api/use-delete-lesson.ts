import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS } from "@/modules/endpoints";
import { toast } from "sonner";
import privateClient from "@/lib/client/private-client";

export const useDeleteLesson = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await privateClient.delete(
        ENDPOINTS.INSTRUCTOR.DELETE_LESSON(id)
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Lesson deleted successfully");

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
