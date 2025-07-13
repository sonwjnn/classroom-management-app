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
import { smsLoginSchema } from "@/modules/auth/schema";
import PhoneInput from "react-phone-number-input";

import { useNavigate } from "react-router-dom";
import { useSMSLogin } from "@/modules/auth/api/use-sms-login";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CardWrapper } from "./card-wrapper";

export const AuthSMSForm = ({
  type,
}: {
  type: "login" | "register" | "otp";
}) => {
  const navigate = useNavigate();

  const { mutateAsync: smsLogin, isPending: signInLoading } = useSMSLogin();

  const form = useForm<z.infer<typeof smsLoginSchema>>({
    mode: "all",
    resolver: zodResolver(smsLoginSchema),
    defaultValues: {
      phone: "",
      code: "",
    },
  });

  const watchCode = form.watch("code");

  const onSubmit = async (values: z.infer<typeof smsLoginSchema>) => {
    const response = await smsLogin(values);
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
                  <FormLabel>Phone</FormLabel>
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
