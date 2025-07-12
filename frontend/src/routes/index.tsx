import ProtectedRoute from "./protected-route";

import { Navigate, Route, Routes } from "react-router-dom";
import { StudentView } from "@/modules/students/ui/views/student-view";
import { LessonView } from "@/modules/lessons/ui/views/lesson-view";
import { MessageView } from "@/modules/messages/ui/views/message-view";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

import AuthLayout from "@/modules/auth/ui/layouts/auth-layout";
import MainLayout from "@/components/common/main-layout";

export const Routers = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="" element={<AuthLayout />}>
          <Route path="/login" element={<SignInView />} />
          <Route path="/register" element={<SignUpView />} />
        </Route>
        <Route path="" element={<MainLayout />}>
          <Route index element={<StudentView />} />
          <Route path="/lessons" element={<LessonView />} />
          <Route path="/messages" element={<MessageView />} />
        </Route>
      </Route>
    </Routes>
  );
};
