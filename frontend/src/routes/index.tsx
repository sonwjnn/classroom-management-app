import ProtectedRoute from "./protected-route";

import { Outlet, Route, Routes } from "react-router-dom";
import { StudentView } from "@/modules/instructors/ui/views/student-view";
import { LessonsView as LessonViewStudent } from "@/modules/students/ui/views/lessons-view";
import { LessonsView as LessonsViewInstructor } from "@/modules/instructors/ui/views/lessons-view";
import { MessageView } from "@/modules/messages/ui/views/message-view";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
// import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

import AuthLayout from "@/modules/auth/ui/layouts/auth-layout";
import StudentLayout from "@/modules/students/ui/layouts/student-layout";
import InstructorLayout from "@/modules/instructors/ui/layouts/instructor-layout";
import RedirectRoute from "./redirect-route";
import { SetupAccountView } from "@/modules/auth/ui/views/setup-account-view";
import { ProfileView } from "@/modules/students/ui/views/profile-view";
export const Routers = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<SignInView />} />
        {/* <Route path="register" element={<SignUpView />} /> */}
        <Route path="setup-account" element={<SetupAccountView />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="/students" element={<Outlet />}>
            <Route index element={<LessonViewStudent />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="messages" element={<MessageView />} />
          </Route>
        </Route>

        <Route element={<InstructorLayout />}>
          <Route path="/instructors" element={<Outlet />}>
            <Route index element={<StudentView />} />
            <Route path="lessons" element={<LessonsViewInstructor />} />
            <Route path="messages" element={<MessageView />} />
          </Route>
        </Route>
      </Route>
      <Route path="/" element={<RedirectRoute />} />
    </Routes>
  );
};
