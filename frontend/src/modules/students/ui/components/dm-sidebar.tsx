import { ScrollArea } from "@/components/ui/scroll-area";
import { DMItem } from "./dm-item";
import { useGetMyInstructor } from "../../api/use-get-my-instructor";

export const DMSidebar = () => {
  const { data: user, isLoading } = useGetMyInstructor();

  if (isLoading)
    return (
      <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-zinc-50 text-primary ">
        Loading...
      </aside>
    );

  if (!user)
    return (
      <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-zinc-50 text-primary ">
        No instructor found
      </aside>
    );

  return (
    <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-zinc-50 text-primary ">
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-y-1">
          <DMItem key={user?.id} id={user?.id} name={user?.name} />
        </div>
      </ScrollArea>
    </aside>
  );
};
