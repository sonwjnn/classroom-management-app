import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, LoginResponse } from "../types";
import { ENDPOINTS } from "@/modules/endpoints";

export const useLoginSMS = () => {
  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (json) => {
      const response = await fetch(ENDPOINTS.AUTH.LOGIN_SMS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      });

      if (!response.ok) {
        const data = await response.json();
        if ("error" in data) {
          throw new Error(data.error);
        }
        throw new Error("Something went wrong");
      }

      return await response.json();
    },
  });

  return mutation;
};
