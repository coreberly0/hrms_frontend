"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarPlus,
  ClipboardList,
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

          {/* Apply Leave */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(
                `/employee/${empId}/apply-leave`
              )}
            >
              <Link
                href={`/employee/${empId}/apply-leave`}
                className="flex gap-3 px-4 py-2"
              >
                <CalendarPlus className="h-5 w-5" />
                Apply Leave
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* My Leaves */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(
                `/employee/${empId}/my-leaves`
              )}
            >
              <Link
                href={`/employee/${empId}/my-leaves`}
                className="flex gap-3 px-4 py-2"
              >
                <ClipboardList className="h-5 w-5" />
                My Leaves
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
