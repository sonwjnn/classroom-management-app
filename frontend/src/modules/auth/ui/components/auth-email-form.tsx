import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { emailLoginSchema } from "@/modules/auth/schema";

import { useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CardWrapper } from "./card-wrapper";
import { useEmailLogin } from "@/modules/auth/api/use-email-login";
import { Input } from "@/components/ui/input";

export const AuthEmailForm = ({ type }: { type: "login" | "otp" }) => {
  const navigate = useNavigate();

  const { mutateAsync: emailLogin, isPending: signInLoading } = useEmailLogin();

  const form = useForm<z.infer<typeof emailLoginSchema>>({
    mode: "all",
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const watchCode = form.watch("code");

  const onSubmit = async (values: z.infer<typeof emailLoginSchema>) => {
    const response = await emailLogin(values);
    if (response && !response.user) {
      navigate("/auth/login?type=otp");
    }

    if (response && response.user) {
      if (response.user.role === "student") {
        navigate("/students");
      }

      if (response.user.role === "instructor") {
        navigate("/instructors");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
        {type === "otp" ? (
          <CardWrapper
            headerLabel="Enter the code"
            headerDescription="Enter the code sent to your email"
            type="otp"
          >
            <div className="flex items-center justify-center">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={(code) => field.onChange(`${code}`)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={signInLoading || !watchCode}
              type="submit"
              size="lg"
              variant="default"
              className="w-full"
            >
              Verify
            </Button>
          </CardWrapper>
        ) : (
          <CardWrapper
            headerLabel={
              type === "login" ? "Login to continue" : "Sign up to continue"
            }
            headerDescription="Use your email to continue"
            type={type === "login" ? "login" : "register"}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={signInLoading}
              type="submit"
              size="lg"
              variant="default"
              className="w-full"
            >
              Next
            </Button>
          </CardWrapper>
        )}
      </form>
    </Form>
  );
};
