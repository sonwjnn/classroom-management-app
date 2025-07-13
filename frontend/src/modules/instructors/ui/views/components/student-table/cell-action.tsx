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
import { useDeleteStudent } from "@/modules/instructors/api/use-delete-student";
import type { StudentColumn } from "@/modules/instructors/ui/views/components/student-table/columns";

interface CellActionProps {
  data: StudentColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [ConfirmDialog, comfirm] = useConfirm(
    "Delete Student",
    "Are you sure you want to delete this student?"
  );
  const { onOpen } = useModal();

  const { mutateAsync: deleteStudent } = useDeleteStudent({
    phone: data.phone,
  });

  const onDelete = async () => {
    const ok = await comfirm();
    if (!ok) return;

    await deleteStudent();
  };

  const onUpdate = () => {
    onOpen("editStudent", {
      student: data,
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
