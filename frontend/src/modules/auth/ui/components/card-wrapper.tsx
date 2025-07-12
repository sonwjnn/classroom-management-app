import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  headerDescription?: string;
  showSocial?: boolean;
  type?: "login" | "register" | "otp";
}

export const CardWrapper = ({
  children,
  headerLabel,
  headerDescription = "",
  type,
}: CardWrapperProps) => {
  const isLogin = type === "login";
  const isSignup = type === "register";
  const isOtp = type === "otp";
  const isOther = !isLogin && !isSignup && !isOtp;

  return (
    <Card className="p-8 w-[400px]">
      <CardHeader className="px-0 pt-0">
        <CardTitle>{headerLabel}</CardTitle>
        <CardDescription>{headerDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        {children}
        {isLogin && (
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/auth/register" onClick={() => {}}>
              <span className="text-sky-700 hover:underline">Sign up</span>
            </Link>
          </p>
        )}
        {isSignup && (
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" onClick={() => {}}>
              <span className="text-sky-700 hover:underline">Sign in</span>
            </Link>
          </p>
        )}
        {isOtp && (
          <p className="text-xs text-muted-foreground">
            <Link to="/auth/login" onClick={() => {}}>
              <span className="text-sky-700 hover:underline">
                Back to login
              </span>
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
