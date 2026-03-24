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

import { useSidebar } from "@/components/ui/sidebar";

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

  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("employeeData") || "{}");
      setRole(data?.role || "employee");
    } catch {
      setRole("employee");
    }
  }, []);

  if (!empId || role === null) return null;

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="!bg-[#0b1220] text-white border-r border-slate-800 shadow-xl"
    >

      {/* HEADER */}
      <SidebarHeader className="!bg-[#0b1220] px-4 py-4 border-b border-slate-800">

        <div className="flex items-center gap-3">

          {/* ICON (VISIBLE ALWAYS) */}
          <LayoutDashboard className="h-6 w-6 text-blue-500" />

          {/* TEXT (HIDE ON COLLAPSE) */}
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="text-xl font-bold">
              <span className="text-blue-500">HRMS</span> Panel
            </div>

            <div className="text-xs mt-1 px-2 py-1 w-fit bg-blue-500/20 text-blue-300 rounded-md capitalize">
              {role}
            </div>
          </div>

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
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 data-[active=true]:bg-blue-600 group-data-[collapsible=icon]:justify-center"
            >
              <Link href={`/employee/${empId}`}>
                <LayoutDashboard className="h-6 w-6" />

                <span className="group-data-[collapsible=icon]:hidden">
                  Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* ATTENDANCE */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/attendance`)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 data-[active=true]:bg-blue-600 group-data-[collapsible=icon]:justify-center"
            >
              <Link href={`/employee/${empId}/attendance`}>
                <CalendarCheck className="h-6 w-6" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Attendance
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* EMPLOYEE LIST */}
          {(role === "admin" || role === "hr") && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.includes("employeeList")}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 data-[active=true]:bg-blue-600 group-data-[collapsible=icon]:justify-center"
              >
                <Link href={`/employee/${empId}/employeeList`}>
                  <Users className="h-6 w-6" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Employee List
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* TEAM */}
          {role === "manager" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.includes("team-member")}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 data-[active=true]:bg-blue-600 group-data-[collapsible=icon]:justify-center"
              >
                <Link href={`/employee/${empId}/team-member`}>
                  <Users className="h-6 w-6" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Team Members
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* PROJECTS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/projects`)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 data-[active=true]:bg-blue-600 group-data-[collapsible=icon]:justify-center"
            >
              <Link href={`/employee/${empId}/projects`}>
                <FolderKanban className="h-6 w-6" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Projects
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* PROFILE */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes("ProfileDashboard")}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 data-[active=true]:bg-blue-600 group-data-[collapsible=icon]:justify-center"
            >
              <Link href={`/employee/${empId}/ProfileDashboard`}>
                <User className="h-6 w-6" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Profile
                </span>
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
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 group-data-[collapsible=icon]:justify-center"
            >
              <LogOut className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  );
}