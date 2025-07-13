import { BookOpen } from "lucide-react";
import type { Lesson } from "../../types";
import { LessonCard } from "./lesson-card";

interface LessonGridProps {
  lessons: Lesson[];
  onMarkAsDone: (lessonId: string) => void;
  onStartLesson: (lessonId: string) => void;
  isMarkingDone: boolean;
}

export const LessonGrid = ({
  lessons,
  onMarkAsDone,
  onStartLesson,
  isMarkingDone,
}: LessonGridProps) => {
  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No lessons found</h3>
        <p className="text-muted-foreground max-w-md">
          No lessons match your current filters. Try adjusting your search or
          filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.lesson_id}
          lesson={lesson}
          onMarkAsDone={onMarkAsDone}
          onStartLesson={onStartLesson}
          isMarkingDone={isMarkingDone}
        />
      ))}
    </div>
  );
};
