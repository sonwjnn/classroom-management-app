import { Navbar } from "@/modules/auth/ui/components/navbar";
import { Outlet } from "react-router-dom";
import { useCurrentRole } from "../../api/use-current-role";

export default function AuthLayout() {
  useCurrentRole();

  return (
    <div className="w-full">
      <Navbar />
      <main className="bg-[#F4F4F4] flex items-center justify-center min-h-[calc(100vh-4rem)] ">
        {<Outlet />}
      </main>
    </div>
  );
}
