import { BookOpenTextIcon, GraduationCap, MessageCircle } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";

const items = [
  {
    title: "My Lessons",
    url: "/students",
    icon: GraduationCap,
  },
  {
    title: "My Profile",
    url: "/students/profile",
    icon: BookOpenTextIcon,
  },
  {
    title: "Message",
    url: "/students/messages",
    icon: MessageCircle,
  },
];

export const SidebarSection = () => {
  const pathname = useLocation().pathname;

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname === item.url}
                className="cursor-pointer"
                asChild
              >
                <Link
                  to={item.url}
                  className="flex items-center gap-4 px-4 py-6"
                >
                  <item.icon />
                  <span className="text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
