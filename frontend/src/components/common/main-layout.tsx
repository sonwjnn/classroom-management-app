import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "./main-sidebar";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="w-full">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)] pt-[4rem]">
          <MainSidebar />
          <main className="flex-1 overflow-y-auto">{<Outlet />}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
