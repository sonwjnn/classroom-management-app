import { useMutation } from "@tanstack/react-query";
import type { EmailLoginRequest, EmailLoginResponse } from "../types";
import { ENDPOINTS } from "@/modules/endpoints";
import { toast } from "sonner";
import publicClient from "@/lib/client/public-client";
import { TOKEN_NAME, USER_STORAGE_NAME } from "@/constants";

export const useEmailLogin = () => {
  const mutation = useMutation<EmailLoginResponse, Error, EmailLoginRequest>({
    mutationFn: async (json) => {
      const response = await publicClient.post(
        ENDPOINTS.AUTH.LOGIN_EMAIL,
        json
      );
      localStorage.setItem(TOKEN_NAME, response.data.accessToken);
      localStorage.setItem(
        USER_STORAGE_NAME,
        JSON.stringify(response.data.user)
      );

      return response.data;
    },
    onError: () => {
      return toast.error("Something went wrong");
    },
  });

  return mutation;
};
