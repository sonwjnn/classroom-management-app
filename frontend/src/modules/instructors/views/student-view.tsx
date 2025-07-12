import { TablesClient } from "../components/client";
import { useGetStudents } from "@/modules/instructors/api/use-get-students";

export const StudentView = () => {
  const { data, isLoading } = useGetStudents();

  if (isLoading) return <div>Loading...</div>;

  const students = data?.map((student) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone,
    role: student.role,
    status: student.status,
  }));

  return (
    <div className="bg-[#F4F4F4] min-h-[calc(100vh-4rem)] p-16">
      <TablesClient data={students || []} />
    </div>
  );
};
