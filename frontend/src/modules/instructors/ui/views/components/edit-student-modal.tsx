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
import { updateStudentSchema } from "@/modules/instructors/schema";
import { useModal } from "@/store/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import PhoneInput from "react-phone-number-input";
import { useEditStudent } from "../../../api/use-edit-student";

export const EditStudentModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { mutateAsync: editStudent, isPending } = useEditStudent({
    phone: data?.student?.phone || "",
  });

  const isModalOpen = isOpen && type === "editStudent";
  const { student } = data;

  const form = useForm({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: {
      name: student?.name || "",
      email: student?.email || "",
      newPhone: student?.phone || "",
    },
  });

  useEffect(() => {
    if (student && isModalOpen) {
      form.setValue("name", student.name);
      form.setValue("email", student.email || "");
      form.setValue("newPhone", student.phone);
    }
  }, [form, student, isModalOpen]);

  const onSubmit = async (values: z.infer<typeof updateStudentSchema>) => {
    await editStudent(values).then(() => {
      onClose();
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold ">
            Edit Student
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300">
                      Student name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Enter student name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300">
                      Email
                    </FormLabel>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="Enter student email"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300">
                      Phone
                    </FormLabel>
                    <PhoneInput
                      {...field}
                      placeholder="Enter phone number"
                      defaultCountry="US"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
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
