import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";

export const DMItem = ({ id, name }: { id: string; name: string }) => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.userId || "";

  const onClick = () => {
    navigate(`/instructors/messages/${id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group mb-1 flex w-full bg-zinc-100 items-center gap-x-2 rounded-md px-3 py-4  transition hover:bg-zinc-700/10 cursor-pointer",
        userId === id && "bg-zinc-700/20 "
      )}
    >
      <UserAvatar imageUrl={"/"} name={name} />
      <p
        className={cn(
          "text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 ",
          userId === id && "text-primary"
        )}
      >
        {name}
      </p>
    </button>
  );
};
