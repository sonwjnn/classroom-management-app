import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Settings, User } from "lucide-react";
import { useGetProfile } from "@/modules/students/api/use-get-profile";

export const ProfileForm = () => {
  const { data, isLoading } = useGetProfile();

  if (isLoading) return <div>Loading...</div>;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input value={data?.name} disabled />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>

            <Input type="email" value={data?.email} disabled />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input value={data?.phone} disabled />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Instructor Phone Number
            </Label>
            <Input value={data?.instructor_phone} disabled />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Label className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Role
            </Label>
            <Input value={data?.role} disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
