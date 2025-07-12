import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "@/components/common/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InstructorSidebar } from "../components/instructor-sidebar";
import { useCurrentRole } from "@/modules/auth/api/use-current-role";
import { useNavigate } from "react-router-dom";

export default function InstructorLayout() {
  const navigate = useNavigate();

  const { data, isLoading } = useCurrentRole({
    phone: localStorage.getItem("phone")!,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.role !== "instructor") {
    navigate("/");
    return;
  }

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
