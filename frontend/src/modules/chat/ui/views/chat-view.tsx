import { useParams } from "react-router-dom";
import { ChatHeader } from "../components/chat-header";
import { ChatInput } from "../components/chat-input";
import { ChatMessages } from "../components/chat-messages";
import { useGetOrCreateConversations } from "../../api/use-get-or-create-conversation";
import { useGetProfile } from "@/modules/students/api/use-get-profile";

export const ChatView = () => {
  const params = useParams();
  const userId = (params?.userId as string) || "";
  const { data: currentUser, isLoading: isUserLoading } = useGetProfile();
  const { data: conversation, isPending } = useGetOrCreateConversations(userId);

  if (isPending || isUserLoading) {
    return <div className="flex h-full flex-col bg-white">Loading...</div>;
  }

  if (!conversation || !currentUser) return null;

  const otherUser =
    conversation?.user_one_id === currentUser?.id
      ? conversation?.user_two
      : conversation?.user_one;

  const otherUserName = otherUser.name || "";

  return (
    <div className="flex h-full flex-col bg-white">
      <ChatHeader name={otherUserName} />

      <ChatMessages
        currentUser={currentUser}
        name={otherUserName}
        chatId={conversation.id}
        conversationId={conversation.id}
      />
      <ChatInput name={otherUserName} conversationId={conversation.id} />
    </div>
  );
};
