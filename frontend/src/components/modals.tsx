import { CreateStudentModal } from "@/modules/instructors/ui/views/components/create-student-modal";
import { EditStudentModal } from "@/modules/instructors/ui/views/components/edit-student-modal";
import { CreateLessonModal } from "@/modules/instructors/ui/views/components/create-lesson-modal";
import { EditLessonModal } from "@/modules/instructors/ui/views/components/edit-lesson-modal";

export const Modals = () => {
  return (
    <>
      <CreateStudentModal />
      <EditStudentModal />
      <CreateLessonModal />
      <EditLessonModal />
    </>
  );
};
