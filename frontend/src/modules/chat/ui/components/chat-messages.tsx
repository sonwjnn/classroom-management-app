import { ChatItem } from "./chat-item";
import { useRef, type ComponentRef } from "react";

export const ChatMessages = () => {
  const chatRef = useRef<ComponentRef<"div">>(null);
  const bottomRef = useRef<ComponentRef<"div">>(null);
  return (
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      {/* {!hasNextPage && <div className="flex-1" />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 size-6 animate-spin text-zinc-500" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              Load previous messages
            </button>
          )}
        </div>
      )} */}
      <div className="mt-auto flex flex-col-reverse">
        {/* {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithUser) => (
              <ChatItem
                key={message.id}
                
              />
            ))}
          </Fragment>
        ))} */}
        {Array.from({ length: 10 }).map((_, i) => (
          <ChatItem key={i} />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
