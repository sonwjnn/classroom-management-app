import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS } from "@/modules/endpoints";
import axios from "axios";
import { toast } from "sonner";

export const useDeleteStudent = ({ phone }: { phone: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(
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
