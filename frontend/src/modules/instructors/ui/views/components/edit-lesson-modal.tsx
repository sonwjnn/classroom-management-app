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
import { useGetStudents } from "@/modules/instructors/api/use-get-students";
import MultipleSelector, {
  type Option,
} from "@/components/ui/mutiple-selector";
import { useEffect } from "react";
import { useEditLesson } from "@/modules/instructors/api/use-edit-lesson";

export const EditLessonModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { lesson } = data;
  const { mutateAsync: editLesson, isPending: editLessonPending } =
    useEditLesson(lesson?.id || "");
  const { data: students, isLoading: studentsLoading } = useGetStudents();

  const isModalOpen = isOpen && type === "editLesson";
  const isPending = editLessonPending || studentsLoading;

  const form = useForm<z.infer<typeof createLessonSchema>>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedStudents: [],
    },
  });

  useEffect(() => {
    if (lesson && isModalOpen) {
      console.log(lesson);
      form.setValue("title", lesson.title);
      form.setValue("description", lesson.description);
      form.setValue(
        "assignedStudents",
        lesson.assigned_students.map((student) => ({
          value: student.student_id,
          label: student.email!,
        }))
      );
    }
  }, [form, lesson, isModalOpen]);

  const onSubmit = async (values: z.infer<typeof createLessonSchema>) => {
    const currentStudentIds =
      lesson?.assigned_students.map((s) => s.student_id) || [];

    const newStudentIds = values.assignedStudents.map((s) => s.value);

    const hasChanged =
      newStudentIds.length !== currentStudentIds.length ||
      !newStudentIds.every((id) => currentStudentIds.includes(id)) ||
      !currentStudentIds.every((id) => newStudentIds.includes(id));

    const assignedStudents = hasChanged
      ? students
          ?.filter((student) => newStudentIds.some((s) => s === student.id))
          ?.map((s) => ({
            id: s?.id!,
            lesson_id: lesson?.id!,
            student_id: s?.id!,
            name: s?.name!,
            phone: s?.phone!,
            email: s?.email!,
          }))
      : undefined;

    await editLesson({
      title: values.title,
      description: values.description,
      ...(assignedStudents !== undefined && {
        assignedStudents,
      }),
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

  useEffect(() => {
    console.log("Form values:", form.watch("assignedStudents"));
  }, [form.watch("assignedStudents")]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Edit Lesson
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
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
