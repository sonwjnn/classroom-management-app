import type { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type StudentColumn = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: "student" | "instructor";
  status: "active" | "inactive";
};

export const columns: ColumnDef<StudentColumn>[] = [
  {
    header: "Index",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Student name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status === "active" ? "Active" : "Inactive"}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
