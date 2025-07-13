import type { Lesson, Student } from "@/modules/instructors/types";
import { create } from "zustand";

export type ModalType =
  | "createStudent"
  | "editStudent"
  | "createLesson"
  | "editLesson";

interface ModalData {
  student?: Pick<Student, "name" | "email" | "phone">;
  lesson?: {
    id: string;
    title: string;
    description: string;
    assigned_students: {
      id: string;
      lesson_id: string;
      student_id: string;
      name: string;
      phone: string;
      email: string;
    }[];
  };
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
