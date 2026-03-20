"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  FolderKanban,
  LogOut,
  User,
  Users,
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

  const [role, setRole] = useState(null);

  // ✅ Load role ONLY on client (prevents hydration error)
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("employeeData") || "{}");
      setRole(data?.role || "employee");
    } catch {
      setRole("employee");
    }
  }, []);

  // ✅ Prevent render until role is ready (avoids mismatch)
  if (!empId || role === null) return null;

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <Sidebar className="!bg-[#0b1220] text-white border-r border-slate-800 shadow-xl">

      {/* HEADER */}
      <SidebarHeader className="!bg-[#0b1220] px-4 py-4 border-b border-slate-800">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-wide">
            <span className="text-blue-500">HRMS</span> Panel
          </span>

          {/* ROLE BADGE */}
          <span className="text-xs mt-2 px-2 py-1 w-fit bg-blue-500/20 text-blue-300 rounded-md capitalize">
            {role}
          </span>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="!bg-[#0b1220] px-2 py-4">
        <SidebarMenu className="space-y-2">

          {/* DASHBOARD */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === `/employee/${empId}`}
              className="rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 data-[active=true]:bg-blue-600 data-[active=true]:shadow-md"
            >
              <Link href={`/employee/${empId}`} className="flex items-center gap-3 px-4 py-2">
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* ATTENDANCE */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/attendance`)}
              className="rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 data-[active=true]:bg-blue-600"
            >
              <Link
                href={`/employee/${empId}/attendance`}
                className="flex items-center gap-3 px-4 py-2"
              >
                <CalendarCheck className="h-5 w-5" />
                Attendance
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* EMPLOYEE LIST (ADMIN + HR) */}
          {(role === "admin" || role === "hr") && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.includes("employeeList")}
                className="rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 data-[active=true]:bg-blue-600"
              >
                <Link
                  href={`/employee/${empId}/employeeList`}
                  className="flex items-center gap-3 px-4 py-2"
                >
                  <Users className="h-5 w-5" />
                  Employee List
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* TEAM (MANAGER) */}
          {role === "manager" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.includes("team-member")}
                className="rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 data-[active=true]:bg-blue-600"
              >
                <Link
                  href={`/employee/${empId}/team-member`}
                  className="flex items-center gap-3 px-4 py-2"
                >
                  <Users className="h-5 w-5" />
                  Team Members
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* PROJECTS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/projects`)}
              className="rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 data-[active=true]:bg-blue-600"
            >
              <Link
                href={`/employee/${empId}/projects`}
                className="flex items-center gap-3 px-4 py-2"
              >
                <FolderKanban className="h-5 w-5" />
                Projects
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* PROFILE */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes("ProfileDashboard")}
              className="rounded-lg bg-white/5 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 data-[active=true]:bg-blue-600"
            >
              <Link
                href={`/employee/${empId}/ProfileDashboard`}
                className="flex items-center gap-3 px-4 py-2"
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="!bg-[#0b1220] border-t border-slate-800 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="rounded-lg transition-all duration-200 hover:bg-red-500/20 text-red-400 hover:text-red-300"
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