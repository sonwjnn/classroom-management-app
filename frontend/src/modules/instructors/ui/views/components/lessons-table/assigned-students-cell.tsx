import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentLesson } from "@/modules/instructors/types";

interface AssignedStudentsCellProps {
  students: StudentLesson[];
  maxVisible?: number;
}

export function AssignedStudentsCell({
  students,
  maxVisible = 3,
}: AssignedStudentsCellProps) {
  const studentCount = students?.length || 0;
  const visibleStudents = students?.slice(0, maxVisible) || [];
  const remainingCount = Math.max(0, studentCount - maxVisible);

  if (studentCount === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <UserX className="h-4 w-4" />
        <span className="text-sm">No students</span>
      </div>
    );
  }

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex -space-x-2">
            {visibleStudents.map((student, index) => (
              <Avatar
                key={student.id}
                className={cn(
                  "h-8 w-8 border-2 border-background transition-transform hover:scale-110 hover:z-10",
                  index > 0 && "ml-0"
                )}
              >
                <AvatarFallback className="text-xs bg-primary/10">
                  {student.student_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            ))}

            {remainingCount > 0 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{remainingCount}
              </div>
            )}
          </div>

          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {studentCount}
          </Badge>
        </div>
      </HoverCardTrigger>

      <HoverCardContent className="w-80" side="top">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Assigned Students</h4>
            <Badge variant="outline">{studentCount} total</Badge>
          </div>

          <ScrollArea className="h-32">
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {student.student_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {student.student_name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {student.student_email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
