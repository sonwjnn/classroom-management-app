import { ScrollArea } from "@/components/ui/scroll-area";
import { DMItem } from "./dm-item";
import { useGetStudents } from "@/modules/instructors/api/use-get-students";

export const DMSidebar = () => {
  const { data: users, isPending } = useGetStudents();

  if (isPending) {
    return (
      <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-zinc-50 text-primary ">
        Loading...
      </aside>
    );
  }

  if (!users) {
    return (
      <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-zinc-50 text-primary ">
        No students found
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-zinc-50 text-primary ">
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-y-1">
          {users.map((user) => (
            <DMItem key={user.id} id={user.id} name={user.name} />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};
