import { Link } from "react-router-dom";
import { SidebarTrigger } from "../ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-gray-200 bg-white flex items-center px-2 pr-5 z-50">
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Menu and Logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link to={"/"}>
            <div className="p-4 pl-2 flex items-center gap-1">
              <p className="text-xl tracking-tight font-bold">classroom</p>
            </div>
          </Link>
        </div>
        {/* Search Bar */}

        <div className="flex-shrink-0 items-center flex gap-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};
