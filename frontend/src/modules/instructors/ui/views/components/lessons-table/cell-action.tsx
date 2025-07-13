import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import { useModal } from "@/store/use-modal-store";
import type { LessonColumn } from "./columns";
import { useDeleteLesson } from "@/modules/instructors/api/use-delete-lesson";

interface CellActionProps {
  data: LessonColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [ConfirmDialog, comfirm] = useConfirm(
    "Delete Lesson",
    "Are you sure you want to delete this lesson?"
  );
  const { onOpen } = useModal();

  const { mutateAsync: deleteLesson } = useDeleteLesson({
    id: data.id,
  });

  const onDelete = async () => {
    const ok = await comfirm();
    if (!ok) return;

    await deleteLesson();
  };

  const onUpdate = () => {
    onOpen("editLesson", {
      lesson: {
        id: data.id,
        title: data.title,
        description: data.description,
        assigned_students:
          data.assigned_students?.map((student) => ({
            id: student.id,
            lesson_id: data.id,
            student_id: student.student_id,
            name: student.student_name,
            phone: student.student_phone,
            email: student.student_email,
          })) || [],
      },
    });
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onUpdate}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
