import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, LoginResponse } from "../types";
import { ENDPOINTS } from "@/modules/endpoints";
import axios from "axios";
import { toast } from "sonner";

export const useLoginSMS = () => {
  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (json) => {
      const response = await axios.post(ENDPOINTS.AUTH.LOGIN_SMS, json);

      return response.data;
    },
    onError: () => {
      return toast.error("Something went wrong");
    },
  });

  return mutation;
};
