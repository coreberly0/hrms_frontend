"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function EmpSidebar() {
  const pathname = usePathname();

  // 🔥 Extract Employee ID → /employee/emp1/...
  const empId = pathname.split("/")[2];

  if (!empId) return null;

  return (
    <Sidebar className="bg-gray-200 text-black">
      <SidebarHeader className="text-xl font-bold px-4 py-3 border-b border-gray-400">
        Employee Panel
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="space-y-1">

          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === `/employee/${empId}`}
            >
              <Link
                href={`/employee/${empId}`}
                className="flex gap-3 px-4 py-2"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Attendance */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(
                `/employee/${empId}/attendance`
              )}
            >
              <Link
                href={`/employee/${empId}/attendance`}
                className="flex gap-3 px-4 py-2"
              >
                <CalendarCheck className="h-5 w-5" />
                Attendance
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Payslip */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(
                `/employee/${empId}/id/payslip`
              )}
            >
              <Link
                href={`/employee/${empId}/id/payslip`}
                className="flex gap-3 px-4 py-2"
              >
                <FileText className="h-5 w-5" />
                Payslip
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
