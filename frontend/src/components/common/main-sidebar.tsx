import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { BookOpenTextIcon, GraduationCap, MessageCircle } from "lucide-react";
import { SidebarSection } from "./sidebar-section";

export const MainSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarSection />
      </SidebarContent>
    </Sidebar>
  );
};
