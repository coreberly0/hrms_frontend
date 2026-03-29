"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  FolderKanban,
  FileText,
  LogOut,
  User,
  Users,
  MessageSquare,
  AlertCircle,
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
  const [policyMenuOpen, setPolicyMenuOpen] = useState(false);

  const { toggleSidebar } = useSidebar();

  const policyItems = [
    { key: "attendance-working-hours", label: "Attendance & Working Hours", href: `/employee/${empId}/Policies/attendance-working-hours` },
    { key: "leave", label: "Leave", href: `/employee/${empId}/Policies/leave` },
    { key: "payroll-salary", label: "Payroll / Salary", href: `/employee/${empId}/Policies/payroll-salary` },
    { key: "it-security", label: "IT & Security", href: `/employee/${empId}/Policies/it-security` },
    { key: "exit-resignation", label: "Exit & Resignation", href: `/employee/${empId}/Policies/exit-resignation` },
  ];

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("employeeData") || "{}");
      setRole(data?.role || "employee");
    } catch {
      setRole("employee");
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith(`/employee/${empId}/Policies`)) {
      setPolicyMenuOpen(true);
    }
  }, [pathname, empId]);

  if (!empId || role === null) return null;

  const navButtonClass =
    "flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 data-[active=true]:bg-[#3d4a8f] data-[active=true]:text-white transition-colors duration-200 group-data-[collapsible=icon]:justify-center";
  const navLabelClass =
    "group-data-[collapsible=icon]:hidden text-[15px] font-semibold tracking-wide";

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // ✅ ROLE COLORS
  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "hr":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "manager":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#0b1220]! text-white font-sans border-r border-slate-800 shadow-xl"
    >

      {/* HEADER */}
      <SidebarHeader className="bg-[#0b1220]! px-4 py-4 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <LayoutDashboard className="h-6 w-6 text-blue-800" />

          {/* TEXT */}
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-blue-800">HRMS</span> Panel
            </div>

            {/* ✅ ROLE CHIP */}
            <div
              className={`text-xs mt-1 px-3 py-1 w-fit rounded-full border capitalize font-medium ${getRoleStyle(
                role
              )}`}
            >
              {role}
            </div>

          </div>

        </div>

      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="bg-[#0b1220]! px-2 py-4">
        <SidebarMenu className="space-y-2">

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === `/employee/${empId}`}
              className={navButtonClass}
            >
              <Link href={`/employee/${empId}`}>
                <LayoutDashboard className="h-5 w-5" />
                <span className={navLabelClass}>
                  Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/attendance`)}
              className={navButtonClass}
            >
              <Link href={`/employee/${empId}/attendance`}>
                <CalendarCheck className="h-5 w-5" />
                <span className={navLabelClass}>
                  Attendance
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {(role === "admin" || role === "hr") && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.includes("employeeList")}
                className={navButtonClass}
              >
                <Link href={`/employee/${empId}/employeeList`}>
                  <Users className="h-5 w-5" />
                  <span className={navLabelClass}>
                    Employee List
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {role === "manager" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.includes("team-member")}
                className={navButtonClass}
              >
                <Link href={`/employee/${empId}/team-member`}>
                  <Users className="h-5 w-5" />
                  <span className={navLabelClass}>
                    Team Members
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/projects`)}
              className={navButtonClass}
            >
              <Link href={`/employee/${empId}/projects`}>
                <FolderKanban className="h-5 w-5" />
                <span className={navLabelClass}>
                  Projects
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setPolicyMenuOpen((prev) => !prev)}
              isActive={pathname.startsWith(`/employee/${empId}/Policies`)}
              className={navButtonClass}
            >
              <FileText className="h-5 w-5" />
              <span className={navLabelClass}>Policies</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {policyMenuOpen && (
            <div className="group-data-[collapsible=icon]:hidden ml-4 mt-1 mb-2 space-y-1">
              {policyItems.map((item) => {
                const isActivePolicy = pathname === item.href;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-[13px] transition-colors ${
                      isActivePolicy
                        ? "bg-[#3d4a8f] text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/grievances`)}
              className={navButtonClass}
            >
              <Link href={`/employee/${empId}/grievances`}>
                <AlertCircle className="h-5 w-5" />
                <span className={navLabelClass}>
                  Grievances
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* CHAT */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/employee/${empId}/chat`)}
              className={navButtonClass}
            >
              <Link
                href={`/employee/${empId}/chat`}
                className="flex items-center gap-3"
              >
                <MessageSquare className="h-5 w-5" />
                <span className={navLabelClass}>Messages</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* PROFILE */}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.includes("ProfileDashboard")}
              className={navButtonClass}
            >
              <Link href={`/employee/${empId}/ProfileDashboard`}>
                <User className="h-5 w-5" />
                <span className={navLabelClass}>
                  Profile
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="bg-[#0b1220]! border-t border-slate-800 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 group-data-[collapsible=icon]:justify-center"
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