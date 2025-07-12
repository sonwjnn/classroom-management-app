import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/common/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "../components/student-sidebar";
import { useCurrentRole } from "@/modules/auth/api/use-current-role";
import { useNavigate } from "react-router-dom";

export default function StudentLayout() {
  const navigate = useNavigate();

  const { data, isLoading } = useCurrentRole({
    phone: localStorage.getItem("phone")!,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.role !== "student") {
    navigate("/");
    return;
  }

  return (
    <SidebarProvider>
      <div className="w-full">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)] pt-[4rem]">
          <StudentSidebar />
          <main className="flex-1 overflow-y-auto">{<Outlet />}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
