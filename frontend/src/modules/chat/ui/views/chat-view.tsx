import { ChatHeader } from "../components/chat-header";
import { ChatInput } from "../components/chat-input";
import { ChatMessages } from "../components/chat-messages";

export const ChatView = () => {
  return (
    <div className="flex h-full flex-col bg-white">
      <ChatHeader name={"name"} />

      <ChatMessages />
      <ChatInput />
    </div>
  );
};
