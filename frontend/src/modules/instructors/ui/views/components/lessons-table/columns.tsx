import type { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import { type Lesson } from "@/modules/instructors/types";
import { AssignedStudentsCell } from "./assigned-students-cell";

export type LessonColumn = Pick<
  Lesson,
  | "id"
  | "title"
  | "description"
  | "created_by"
  | "created_at"
  | "assigned_students"
>;

export const columns: ColumnDef<LessonColumn>[] = [
  {
    header: "Index",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "created_by",
    header: "Created by",
  },
  {
    accessorKey: "assigned_students",
    header: "Assigned students",
    cell: ({ row }) => (
      <AssignedStudentsCell students={row.original.assigned_students || []} />
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created at",
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
