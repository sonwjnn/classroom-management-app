import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS } from "@/modules/endpoints";
import { toast } from "sonner";
import privateClient from "@/lib/client/private-client";

export const useDeleteStudent = ({ phone }: { phone: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await privateClient.delete(
        ENDPOINTS.INSTRUCTOR.DELETE_STUDENT(phone)
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Student deleted successfully");

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
