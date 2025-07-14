import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";

interface ChatItemProps {
  name: string;
  content: string;
  timestamp: string;
}

export const ChatItem = ({ name, content, timestamp }: ChatItemProps) => {
  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <UserAvatar imageUrl={"/"} name={name} />

        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="cursor-pointer text-base font-medium text-zinc-600 hover:underline ">
                {name}
              </p>
            </div>
            {/* <span className="text-xs text-zinc-500 ">{timestamp}</span> */}
          </div>

          <p className={cn("text-base text-zinc-600 ")}>{content}</p>
        </div>
      </div>
    </div>
  );
};
