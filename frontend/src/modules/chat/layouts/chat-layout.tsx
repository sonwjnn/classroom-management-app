import { DMSidebar } from "../ui/components/dm-sidebar";
import { Outlet } from "react-router-dom";

export const ChatLayout = () => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 pt-16 z-20 hidden h-full w-60 flex-col md:flex">
        <DMSidebar />
      </div>
      <main className="h-full md:pl-60">
        <Outlet />
      </main>
    </div>
  );
};
