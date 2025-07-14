import { getMessagesByConversationId } from "../data/message";
import { useSocket } from "@/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ChatQueryProps {
  queryKey: string;
  conversationId: string;
}

export const useChatQuery = ({ queryKey, conversationId }: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({
    pageParam,
  }: {
    pageParam: string | undefined;
  }) => {
    const res = await getMessagesByConversationId({
      cursor: pageParam,
      conversationId: conversationId,
    });

    return res;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: undefined,
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
