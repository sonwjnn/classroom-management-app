import { Outlet } from "react-router-dom";
import { Navbar } from "@/modules/auth/ui/components/navbar";
import { useNavigate } from "react-router-dom";
import { useCurrentRole } from "../../api/use-current-role";

export default function AuthLayout() {
  const navigate = useNavigate();

  const { data, isLoading } = useCurrentRole({
    phone: localStorage.getItem("phone")!,
  });

  if (isLoading) return <div>Loading...</div>;

  if (data?.role === "student") {
    navigate("/students");
    return;
  }

  if (data?.role === "instructor") {
    navigate("/instructors");
    return;
  }

  return (
    <div className="w-full">
      <Navbar />
      <main className="bg-[#F4F4F4] flex items-center justify-center min-h-[calc(100vh-4rem)] ">
        {<Outlet />}
      </main>
    </div>
  );
}
