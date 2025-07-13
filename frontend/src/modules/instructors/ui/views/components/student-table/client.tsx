import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

import { type StudentColumn, columns } from "./columns";
import { useModal } from "@/store/use-modal-store";

interface TablesClientProps {
  data: StudentColumn[];
}

export const TablesClient = ({ data }: TablesClientProps) => {
  const { onOpen } = useModal();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Students (${data.length})`}
          description="Manage students"
        />
        <Button onClick={() => onOpen("createStudent")}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
