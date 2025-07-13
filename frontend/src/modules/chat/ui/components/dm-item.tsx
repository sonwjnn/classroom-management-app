import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";

export const DMItem = () => {
  return (
    <button
      onClick={() => {}}
      className={cn(
        "group mb-1 flex w-full bg-zinc-100 items-center gap-x-2 rounded-md px-3 py-4  transition hover:bg-zinc-700/10 "
        // userId === user.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
      disabled={false}
    >
      <UserAvatar imageUrl={"/"} name={"name"} />
      <p
        className={cn(
          "text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 "
          // userId === user.id &&
          //   'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        name
      </p>
    </button>
  );
};
