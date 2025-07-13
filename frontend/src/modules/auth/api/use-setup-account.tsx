import { ENDPOINTS } from "@/modules/endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SetupAccountRequest } from "../types";
import publicClient from "@/lib/client/public-client";

export const useSetupAccount = () => {
  return useMutation<void, Error, SetupAccountRequest>({
    mutationFn: async (json) => {
      const response = await publicClient.post(
        ENDPOINTS.STUDENT.SETUP_ACCOUNT,
        json
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Account verified successfully");
    },
    onError: (error) => {
      return toast.error(error.message || "Something went wrong");
    },
  });
};
