import ProtectedRoute from "./protected-route";

import { Outlet, Route, Routes } from "react-router-dom";
import { StudentView } from "@/modules/instructors/views/student-view";
import { LessonView } from "@/modules/lessons/ui/views/lesson-view";
import { MessageView } from "@/modules/messages/ui/views/message-view";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

import AuthLayout from "@/modules/auth/ui/layouts/auth-layout";
import StudentLayout from "@/modules/students/ui/layouts/student-layout";
import InstructorLayout from "@/modules/instructors/layouts/instructor-layout";
import RedirectRoute from "./redirect-route";
export const Routers = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<SignInView />} />
        <Route path="register" element={<SignUpView />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="/students" element={<Outlet />}>
            <Route index element={<StudentView />} />
            <Route path="lessons" element={<LessonView />} />
            <Route path="messages" element={<MessageView />} />
          </Route>
        </Route>

        <Route element={<InstructorLayout />}>
          <Route path="/instructors" element={<Outlet />}>
            <Route index element={<StudentView />} />
            <Route path="lessons" element={<LessonView />} />
            <Route path="messages" element={<MessageView />} />
          </Route>
        </Route>
      </Route>
      <Route path="/" element={<RedirectRoute />} />
    </Routes>
  );
};
