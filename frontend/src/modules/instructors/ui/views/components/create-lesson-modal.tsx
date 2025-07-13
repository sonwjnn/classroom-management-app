import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createLessonSchema } from "@/modules/instructors/schema";
import { useModal } from "@/store/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCreateLesson } from "../../../api/use-create-lesson";
import { useGetStudents } from "@/modules/instructors/api/use-get-students";
import MultipleSelector, {
  type Option,
} from "@/components/ui/mutiple-selector";

export const CreateLessonModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { mutateAsync: createLesson, isPending: createLessonPending } =
    useCreateLesson();
  const { data: students, isLoading: studentsLoading } = useGetStudents();

  const isModalOpen = isOpen && type === "createLesson";
  const isPending = createLessonPending || studentsLoading;

  const form = useForm<z.infer<typeof createLessonSchema>>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedStudents: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof createLessonSchema>) => {
    const selectedStudentIds = new Set(
      values.assignedStudents.map((student) => student.value)
    );

    const assignedStudents =
      students
        ?.filter((student) => selectedStudentIds.has(student.id))
        ?.map(({ id, name, phone, email }) => ({
          id,
          name,
          phone,
          email: email!,
        })) || [];

    await createLesson({
      ...values,
      assignedStudents,
    }).then(() => {
      onClose();
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const studentOptions: Option[] =
    students?.map((student) => ({
      value: student.id,
      label: student.email!,
    })) || [];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Create Lesson
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter lesson title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter lesson description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300">
                      Assigned Students
                    </FormLabel>
                    <FormControl>
                      <MultipleSelector
                        {...field}
                        defaultOptions={studentOptions}
                        placeholder="Select students..."
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                          </p>
                        }
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                type="submit"
                variant="default"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
