import { HRSidebar } from "@/components/common/hr-sidebar";
import { HRBreadcrumb } from "@/components/common/HRBreadcrumb";
import { HrLogout } from "@/components/common/hr-logout";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function HRLayout({ children }) {
  return (
    <SidebarProvider>
      <HRSidebar />

      <main className="w-full p-4">
        <div className="flex items-center gap-3 mb-4">
          <SidebarTrigger />
          <HRBreadcrumb />
          <HrLogout /> {/* ✅ dynamic HR name */}
        </div>

        {children}
      </main>
    </SidebarProvider>
  );
}
