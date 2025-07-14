import { useMutation } from "@tanstack/react-query";
import type { AddMessageRequest, Message } from "../types";
import { ENDPOINTS } from "@/modules/endpoints";
import { toast } from "sonner";
import privateClient from "@/lib/client/private-client";

export const useAddMessage = () => {
  const mutation = useMutation<Message, Error, AddMessageRequest>({
    mutationFn: async (json) => {
      const response = await privateClient.post(
        ENDPOINTS.CHAT.ADD_MESSAGE,
        json
      );

      return response.data;
    },
    onError: (error) => {
      return toast.error(error.message || "Something went wrong");
    },
  });

  return mutation;
};
