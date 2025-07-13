import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  Clock,
  Calendar,
  MoreVertical,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Lesson } from "../../types";

interface LessonCardProps {
  lesson: Lesson;
  onMarkAsDone: (lessonId: string) => void;
  onStartLesson: (lessonId: string) => void;
  isMarkingDone: boolean;
}

const firestoreTimestampToDate = (timestamp: {
  seconds: number;
  nanoseconds: number;
}): Date => {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        cardClassName: "bg-green-50/50 border-green-200",
      };
    case "in_progress":
      return {
        label: "In Progress",
        icon: BookOpen,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        cardClassName: "bg-yellow-50/50 border-yellow-200",
      };
    case "assigned":
    default:
      return {
        label: "Assigned",
        icon: Clock,
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        cardClassName: "bg-blue-50/50 border-blue-200",
      };
  }
};

export const LessonCard = ({
  lesson,
  onMarkAsDone,
  onStartLesson,
  isMarkingDone,
}: LessonCardProps) => {
  const statusConfig = getStatusConfig(lesson.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        statusConfig.cardClassName
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className={cn(
                  "flex items-center gap-1",
                  statusConfig.className
                )}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight mb-1">
              {lesson.title || `Lesson ${lesson.lesson_id.slice(0, 8)}`}
            </h3>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              {lesson.status === "assigned" && (
                <DropdownMenuItem
                  onClick={() => onStartLesson(lesson.lesson_id)}
                >
                  Start Lesson
                </DropdownMenuItem>
              )}
              {lesson.status !== "completed" && (
                <DropdownMenuItem
                  onClick={() => onMarkAsDone(lesson.lesson_id)}
                >
                  Mark as Done
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {lesson.description || "No description available for this lesson."}
        </p>

        <div className="space-y-3">
          {lesson.created_by && (
            <div className="flex items-center gap-2 text-sm">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-xs">
                  {lesson.created_by
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">by</span>
              <span className="font-medium">{lesson.created_by}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Assigned{" "}
              {format(
                firestoreTimestampToDate(lesson.created_at),
                "MMM d, yyyy"
              )}
            </span>
          </div>

          {lesson.status === "completed" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Completed </span>
            </div>
          )}

          {lesson.updated_at.seconds !== lesson.created_at.seconds && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Updated{" "}
                {format(
                  firestoreTimestampToDate(lesson.updated_at),
                  "MMM d, yyyy"
                )}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {lesson.status !== "completed" && (
        <CardFooter className="pt-0 w-full gap-2">
          <Button
            onClick={() => onMarkAsDone(lesson.lesson_id)}
            disabled={isMarkingDone}
            className="w-full"
            size="sm"
          >
            {isMarkingDone ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Marking...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Done
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
