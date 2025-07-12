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
import { loginSchema } from "@/modules/auth/schema";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router-dom";
import { useLoginSMS } from "@/modules/auth/api/use-login-sms";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CardWrapper } from "./card-wrapper";

export const AuthForm = ({ type }: { type: "login" | "register" | "otp" }) => {
  const navigate = useNavigate();

  const { mutateAsync: loginSMS, isPending: signInLoading } = useLoginSMS();

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      code: "",
    },
  });

  const watchCode = form.watch("code");

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const response = await loginSMS(values);
    if (response && !response.phone) {
      navigate("/auth/login?otp=true");
    }

    if (response && response.phone && response.role) {
      localStorage.setItem("phone", response.phone);

      if (response.role === "student") {
        navigate("/students");
      }

      if (response.role === "instructor") {
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
            headerDescription="Enter the code sent to your phone"
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
            headerDescription="Use your phone number to continue"
            type={type === "login" ? "login" : "register"}
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Phone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      placeholder="Enter phone number"
                      defaultCountry="US"
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
