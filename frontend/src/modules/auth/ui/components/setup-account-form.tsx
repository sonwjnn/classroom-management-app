import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { useSetupAccount } from "../../api/use-setup-account";
import { setupAccountSchema } from "../../schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SetupAccountForm = () => {
  const navigate = useNavigate();
  const { mutateAsync: setupAccount, isPending: setupLoading } =
    useSetupAccount();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const name = searchParams.get("name") || "";

  const form = useForm({
    resolver: zodResolver(setupAccountSchema),
    defaultValues: {
      name: name,
      email: email,
      phone: phone,
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof setupAccountSchema>) => {
    if (!token) {
      toast.error("Missing token!");
      return;
    }

    await setupAccount({ token, ...values }).then(() => {
      navigate("/auth/login");
    });
  };

  if (!token) {
    return null;
  }

  return (
    <Card className="p-8 w-[400px] border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Setup Account</CardTitle>
        <CardDescription className="text-sm">
          Setup your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      disabled={setupLoading}
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
                    disabled={setupLoading}
                    {...field}
                    placeholder="Enter student email"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300">
                    Password
                  </FormLabel>
                  <Input
                    disabled={setupLoading}
                    {...field}
                    type="password"
                    placeholder="Enter student password"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-300">
                    Phone
                  </FormLabel>
                  <PhoneInput
                    {...field}
                    disabled={setupLoading}
                    placeholder="Enter phone number"
                    defaultCountry="US"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="default"
              className="w-full"
              disabled={setupLoading || !form.formState.isValid}
            >
              Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
