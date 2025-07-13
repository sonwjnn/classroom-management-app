export interface Lesson {
  student_phone: string;
  student_name: string;
  student_id: string;
  lesson_id: string;
  created_at: {
    type: string;
    seconds: number;
    nanoseconds: number;
  };
  status: "assigned" | "in_progress" | "completed";
  updated_at: {
    type: string;
    seconds: number;
    nanoseconds: number;
  };
  student_email: string;
  id: string;
  title: string;
  created_by: string;
  description: string;
}
