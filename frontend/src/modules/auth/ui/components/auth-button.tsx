import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User2, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const AuthButton = () => {
  const navigate = useNavigate();
  const name = "John Doe";
  const email = "john.doe@example.com";
  const imageUrl = "https://example.com/john-doe.jpg";

  const handleLogout = () => {
    localStorage.removeItem("phone");
    navigate("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none border-none ">
        <Avatar className="size-10 cursor-pointer ring-offset-background transition hover:ring-primary">
          <AvatarImage alt={name} src={imageUrl || ""} />
          <AvatarFallback className="flex items-center justify-center bg-sky-500 font-medium text-white">
            <User2 className="size-4 text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-xl p-2">
        <div className="space-y-1">
          <Link to="/my-profile/settings">
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
              <UserCircle className="size-4 text-black" />
              My Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm  hover:!bg-red-100 hover:!text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="size-4 group-hover:text-red-700" />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
