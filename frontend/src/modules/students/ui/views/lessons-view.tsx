import { useState } from "react";
import { useGetStudentLessons } from "@/modules/students/api/use-get-student-lessons";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, CheckCircle, Clock } from "lucide-react";
import { LessonGrid } from "../components/lesson-grid";
import { useMarkLessonDone } from "@/modules/students/api/use-mark-lesson-done";

export const LessonsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "assigned" | "completed" | "in_progress"
  >("all");

  const { data: lessonsResponse, isLoading } = useGetStudentLessons();
  const { mutateAsync: markLessonDone, isPending: isMarkingDone } =
    useMarkLessonDone();
  const lessons = lessonsResponse ?? [];
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      (lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (lesson.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      lesson.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lesson.created_by?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);

    const matchesStatus =
      statusFilter === "all" || lesson.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const assignedLessons = lessons?.filter(
    (lesson) => lesson.status === "assigned"
  );
  const completedLessons = lessons?.filter(
    (lesson) => lesson.status === "completed"
  );

  const handleMarkAsDone = async (lessonId: string) => {
    await markLessonDone({ lessonId });
  };

  const handleStartLesson = () => {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Lessons</h1>
          <p className="text-muted-foreground">
            Track your assigned lessons and mark them as completed
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search lessons by title, description, or instructor phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 max-w-[600px] "
          />
        </div>
      </div>

      <Tabs
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as any)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            All ({lessons?.length})
          </TabsTrigger>
          <TabsTrigger value="assigned" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Assigned ({assignedLessons?.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedLessons?.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <LessonGrid
            lessons={filteredLessons}
            onMarkAsDone={handleMarkAsDone}
            onStartLesson={handleStartLesson}
            isMarkingDone={isMarkingDone}
          />
        </TabsContent>

        <TabsContent value="assigned" className="mt-6">
          <LessonGrid
            lessons={filteredLessons.filter((l) => l.status === "assigned")}
            onMarkAsDone={handleMarkAsDone}
            onStartLesson={handleStartLesson}
            isMarkingDone={isMarkingDone}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <LessonGrid
            lessons={filteredLessons.filter((l) => l.status === "completed")}
            onMarkAsDone={handleMarkAsDone}
            onStartLesson={handleStartLesson}
            isMarkingDone={isMarkingDone}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
