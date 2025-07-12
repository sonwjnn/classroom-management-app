import "react-phone-number-input/style.css";
import { useSearchParams } from "react-router-dom";
import { AuthForm } from "@/modules/auth/ui/components/auth-form";

export const SignInView = () => {
  const [searchParams] = useSearchParams();
  const showOtp = !!searchParams.get("otp");

  return (
    <div className="h-full flex items-center justify-center w-full overflow-y-auto">
      <AuthForm type={showOtp ? "otp" : "login"} />
    </div>
  );
};
