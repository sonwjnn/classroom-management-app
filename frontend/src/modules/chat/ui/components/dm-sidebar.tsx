import { ScrollArea } from "@/components/ui/scroll-area";
import { DMItem } from "./dm-item";

export const DMSidebar = () => {
  return (
    <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-zinc-50 text-primary ">
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-y-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <DMItem key={i} />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};
