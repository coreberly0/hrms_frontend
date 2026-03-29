"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  MessageSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function HRSidebar() {
  const pathname = usePathname();

  // 🔥 Extract HR ID from URL → /hr/hr1/...
  const hrId = pathname.split("/")[2];

  if (!hrId) return null;

  const navButtonClass =
    "data-[active=true]:bg-[#3d4a8f] data-[active=true]:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200";
  const navLinkClass = "flex items-center gap-3 px-4 py-2.5";
  const navLabelClass = "text-[15px] font-semibold tracking-wide";

  return (
    <Sidebar className="bg-[#1C225B]! text-white font-sans">
      <SidebarHeader className="bg-[#1C225B]! px-4 py-4 border-b border-[#2a327d]">

        <div className="text-2xl font-extrabold tracking-tight">
          <span className="text-blue-400">HR</span> Panel
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#1C225B]! px-2 py-4">
        <SidebarMenu className="space-y-2">

          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === `/hr/${hrId}`}
              className={navButtonClass}
            >
              <Link href={`/hr/${hrId}`} className={navLinkClass}>
                <LayoutDashboard className="h-5 w-5" />
                <span className={navLabelClass}>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Employees */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/hr/${hrId}/employeeDetails`)}
              className={navButtonClass}
            >
              <Link href={`/hr/${hrId}/employeeDetails`} className={navLinkClass}>
                <Users className="h-5 w-5" />
                <span className={navLabelClass}>Employees</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Attendance */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/hr/${hrId}/attendance`)}
              className={navButtonClass}
            >
              <Link href={`/hr/${hrId}/attendance`} className={navLinkClass}>
                <CalendarCheck className="h-5 w-5" />
                <span className={navLabelClass}>Attendance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Chat */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/hr/${hrId}/chat`)}
              className={navButtonClass}
            >
              <Link href={`/hr/${hrId}/chat`} className={navLinkClass}>
                <MessageSquare className="h-5 w-5" />
                <span className={navLabelClass}>Messages</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
