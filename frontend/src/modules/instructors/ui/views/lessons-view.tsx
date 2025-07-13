import { useGetInstructorLessons } from "../../api/use-get-instructor-lessons";
import { TablesClient } from "./components/lessons-table/client";
import { format } from "date-fns";

type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

export const LessonsView = () => {
  const { data, isLoading } = useGetInstructorLessons();

  if (isLoading) return <div>Loading...</div>;

  const lessons = data?.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    created_by: lesson.created_by,
    created_at: format(
      new Date((lesson.created_at as unknown as Timestamp).seconds * 1000),
      "yyyy-MM-dd"
    ),
    assigned_students: lesson.assigned_students || [],
  }));

  return (
    <div className="bg-[#F4F4F4] min-h-[calc(100vh-4rem)] p-16">
      <TablesClient data={lessons || []} />
    </div>
  );
};
