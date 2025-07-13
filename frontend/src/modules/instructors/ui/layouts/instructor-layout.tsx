import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/common/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InstructorSidebar } from "../views/components/instructor-sidebar";
import { useCurrentRole } from "@/modules/auth/api/use-current-role";

export default function InstructorLayout() {
  useCurrentRole();

  return (
    <SidebarProvider>
      <div className="w-full">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)] pt-[4rem]">
          <InstructorSidebar />
          <main className="flex-1 overflow-y-auto">{<Outlet />}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
