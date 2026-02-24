"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
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

  return (
    <Sidebar className="!bg-[#1C225B] text-white">
      <SidebarHeader className="!bg-[#1C225B] text-xl font-bold px-4 py-3 border-b border-[#1C225B]">

        HR Panel
      </SidebarHeader>

      <SidebarContent className="!bg-[#1C225B] px-2 py-4">
        <SidebarMenu className="space-y-1">

          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === `/hr/${hrId}`}
            >
              <Link href={`/hr/${hrId}`} className="flex gap-3 px-4 py-2">
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Employees */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/hr/${hrId}/employeeDetails`)}
            >
              <Link href={`/hr/${hrId}/employeeDetails`} className="flex gap-3 px-4 py-2">
                <Users className="h-5 w-5" />
                Employees
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Attendance */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/hr/${hrId}/attendance`)}
            >
              <Link href={`/hr/${hrId}/attendance`} className="flex gap-3 px-4 py-2">
                <CalendarCheck className="h-5 w-5" />
                Attendance
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
