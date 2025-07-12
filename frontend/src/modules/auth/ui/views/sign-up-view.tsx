import "react-phone-number-input/style.css";
import { useSearchParams } from "react-router-dom";
import { AuthForm } from "../components/auth-form";

export const SignUpView = () => {
  const [searchParams] = useSearchParams();
  const showOtp = !!searchParams.get("otp");

  return (
    <div className="bg-[#F4F4F4] h-screen flex items-center justify-center w-full overflow-y-auto">
      <AuthForm type={showOtp ? "otp" : "register"} />
    </div>
  );
};
