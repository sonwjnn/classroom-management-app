import { useSearchParams } from "react-router-dom";
import { AuthSMSForm } from "@/modules/auth/ui/components/auth-sms-form";
import { useState } from "react";
import { AuthEmailForm } from "@/modules/auth/ui/components/auth-email-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Phone } from "lucide-react";
import { Mail } from "lucide-react";

export const SignInView = () => {
  const [searchParams] = useSearchParams();

  const [authMethod, setAuthMethod] = useState<"sms" | "email">("sms");
  const authType = (searchParams.get("type") as "login" | "otp") || "login";

  return (
    <div className="h-full flex items-center justify-center w-full overflow-y-auto">
      <div className="w-fit bg-white p-4 rounded-lg border border-gray-200">
        <Tabs
          value={authMethod}
          onValueChange={(value) => setAuthMethod(value as "sms" | "email")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="sms"
              className="flex items-center gap-2"
              disabled={authType === "otp"}
            >
              <Phone className="h-4 w-4" />
              Phone
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="flex items-center gap-2"
              disabled={authType === "otp"}
            >
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sms" className="space-y-4">
            <AuthSMSForm type={authType} />
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <AuthEmailForm type={authType} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
