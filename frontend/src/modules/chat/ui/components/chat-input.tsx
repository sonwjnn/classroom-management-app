import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAddMessage } from "../../api/use-add-message";
interface ChatInputProps {
  name: string;
  conversationId: string;
}
const formSchema = z.object({
  content: z.string().min(1),
});
export const ChatInput = ({ name, conversationId }: ChatInputProps) => {
  const mutation = useAddMessage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      mutation.mutate({
        content: values.content,
        conversationId,
      });
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <Input
                    disabled={false}
                    className="border-0 border-none bg-zinc-200/90 px-8 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 "
                    placeholder={`Send message to ${name}`}
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
