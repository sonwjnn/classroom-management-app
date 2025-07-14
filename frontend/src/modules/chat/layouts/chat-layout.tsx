import { DMSidebar as StudentDMSidebar } from "../../students/ui/components/dm-sidebar";
import { DMSidebar as InstructorDMSidebar } from "../../instructors/ui/views/components/dm-sidebar";
import { Outlet } from "react-router-dom";

export const ChatLayout = ({ type }: { type: "student" | "instructor" }) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 pt-16 z-20 hidden h-full w-60 flex-col md:flex">
        {type === "student" && <StudentDMSidebar />}
        {type === "instructor" && <InstructorDMSidebar />}
      </div>
      <main className="h-full md:pl-60">
        <Outlet />
      </main>
    </div>
  );
};
