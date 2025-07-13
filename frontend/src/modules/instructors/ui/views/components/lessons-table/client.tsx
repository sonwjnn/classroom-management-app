import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

import { type LessonColumn, columns } from "./columns";
import { useModal } from "@/store/use-modal-store";

interface TablesClientProps {
  data: LessonColumn[];
}

export const TablesClient = ({ data }: TablesClientProps) => {
  const { onOpen } = useModal();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Lessons (${data.length})`}
          description="Manage lessons"
        />
        <Button onClick={() => onOpen("createLesson")}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
    </>
  );
};
