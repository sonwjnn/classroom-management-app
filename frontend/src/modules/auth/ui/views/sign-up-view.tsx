// import "react-phone-number-input/style.css";
// import { useSearchParams } from "react-router-dom";
// import { AuthSMSForm } from "@/modules/auth/ui/components/auth-sms-form";
// import { useState } from "react";
// import { AuthEmailForm } from "@/modules/auth/ui/components/auth-email-form";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import { Phone } from "lucide-react";
// import { Mail } from "lucide-react";

// export const SignUpView = () => {
//   const [searchParams] = useSearchParams();
//   const showOtp = !!searchParams.get("otp");

//   const [authMethod, setAuthMethod] = useState<"sms" | "email">("sms");

//   return (
//     <div className="h-full flex items-center justify-center w-full overflow-y-auto">
//       <div className="w-[400px]">
//         <Tabs
//           value={authMethod}
//           onValueChange={(value) => setAuthMethod(value as "sms" | "email")}
//           className="w-full"
//         >
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="sms" className="flex items-center gap-2">
//               <Phone className="h-4 w-4" />
//               Phone
//             </TabsTrigger>
//             <TabsTrigger value="email" className="flex items-center gap-2">
//               <Mail className="h-4 w-4" />
//               Email
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="sms" className="space-y-4">
//             <AuthSMSForm type={showOtp ? "otp" : "register"} />
//           </TabsContent>

//           <TabsContent value="email" className="space-y-4">
//             <AuthEmailForm type={showOtp ? "otp" : "login"} />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };
