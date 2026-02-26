"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  FolderKanban,
  LogOut,
  User
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function EmpSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const empId = pathname.split("/")[2];

  if (!empId) return null;

  const handleLogout = () => {
    localStorage.removeItem("employeeData");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Sidebar className="bg-slate-900 text-white">
      <SidebarHeader className="bg-slate-900 text-xl font-bold px-4 py-3 border-b border-[#1C225B]">
        Employee Panel
      </SidebarHeader>

      <SidebarContent className="bg-slate-900 px-2 py-4">
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
              isActive={pathname.startsWith(`/employee/${empId}/attendance`)}
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

          {/* Payslip
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/payslip`)}
            >
              <Link
                href={`/employee/${empId}/payslip`}
                className="flex gap-3 px-4 py-2"
              >
                <FileText className="h-5 w-5" />
                Payslip
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}

          {/* Projects */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/projects`)}
            >
              <Link
                href={`/employee/${empId}/projects`}
                className="flex gap-3 px-4 py-2"
              >
                <FolderKanban className="h-5 w-5" />
                Projects
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Profile */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/ProfileDashboard`)}
            >
              <Link
                href={`/employee/${empId}/ProfileDashboard`}
                className="flex gap-3 px-4 py-2"
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="bg-slate-900 border-t border-[#1C225B]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-200 hover:text-red-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}