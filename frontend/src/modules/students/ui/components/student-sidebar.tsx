import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SidebarSection } from "./sidebar-section";

export const StudentSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-r border-gray-200" collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarSection />
      </SidebarContent>
    </Sidebar>
  );
};
