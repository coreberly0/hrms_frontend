import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { HRBreadcrumb } from "@/components/common/HRBreadcrumb"
import { HRSidebar } from "@/components/common/hr-sidebar"


export default function HRLayout({ children }) {
  return (
    <SidebarProvider>
      <HRSidebar />
    
      <main className="w-full p-4">
        <div className="flex items-center gap-1.5 ">
          <div className="">
          <SidebarTrigger />
          </div>

        {/* ✅ Dynamic breadcrumb */}
        <HRBreadcrumb />
        </div>

        {children}
      </main>
    </SidebarProvider>
  )
}
