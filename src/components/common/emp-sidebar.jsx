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
    <Sidebar className="relative text-white border-r border-white/10 shadow-2xl overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),transparent_60%)]" />

      <div className="relative z-10 flex flex-col h-full">

        {/* HEADER */}
        <SidebarHeader className="px-5 py-6 border-b border-white/10">
          <div className="flex flex-col gap-3">
            <span className="text-2xl font-extrabold tracking-wide">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                HRMS
              </span>{" "}
              Panel
            </span>

            {/* 🔥 ROLE BADGE (IMPROVED) */}
            <span
              className={`
                relative text-xs px-3 py-1 w-fit rounded-full capitalize font-semibold tracking-wide
                border backdrop-blur-md shadow-lg transition-all duration-300

                ${role === "admin" && "bg-red-500/20 text-red-300 border-red-400/30 shadow-red-500/30"}
                ${role === "hr" && "bg-purple-500/20 text-purple-300 border-purple-400/30 shadow-purple-500/30"}
                ${role === "manager" && "bg-blue-500/20 text-blue-300 border-blue-400/30 shadow-blue-500/30"}
                ${role === "employee" && "bg-emerald-500/20 text-emerald-300 border-emerald-400/30 shadow-emerald-500/30"}
              `}
            >
              {/* glowing dot */}
              <span
                className={`
                  absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse

                  ${role === "admin" && "bg-red-400"}
                  ${role === "hr" && "bg-purple-400"}
                  ${role === "manager" && "bg-blue-400"}
                  ${role === "employee" && "bg-emerald-400"}
                `}
              />

              {role}
            </span>
          </div>
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent className="px-3 py-6">
          <SidebarMenu className="space-y-3">

            {[
              {
                label: "Dashboard",
                icon: LayoutDashboard,
                href: `/employee/${empId}`,
                active: pathname === `/employee/${empId}`,
              },
              {
                label: "Attendance",
                icon: CalendarCheck,
                href: `/employee/${empId}/attendance`,
                active: pathname.startsWith(`/employee/${empId}/attendance`),
              },
              ...(role === "admin" || role === "hr"
                ? [{
                    label: "Employee List",
                    icon: Users,
                    href: `/employee/${empId}/employeeList`,
                    active: pathname.includes("employeeList"),
                  }]
                : []),
              ...(role === "manager"
                ? [{
                    label: "Team Members",
                    icon: Users,
                    href: `/employee/${empId}/team-member`,
                    active: pathname.includes("team-member"),
                  }]
                : []),
              {
                label: "Projects",
                icon: FolderKanban,
                href: `/employee/${empId}/projects`,
                active: pathname.startsWith(`/employee/${empId}/projects`),
              },
              {
                label: "Profile",
                icon: User,
                href: `/employee/${empId}/ProfileDashboard`,
                active: pathname.includes("ProfileDashboard"),
              },
            ].map((item, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton
                  asChild
                  isActive={item.active}
                  className={`
                    relative rounded-xl px-4 py-2 transition-all duration-300
                    bg-white/5 backdrop-blur-md
                    hover:bg-white/10 hover:scale-[1.02]

                    data-[active=true]:bg-gradient-to-r 
                    data-[active=true]:from-blue-500 
                    data-[active=true]:to-purple-500
                    data-[active=true]:shadow-[0_0_20px_rgba(59,130,246,0.6)]
                  `}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-semibold tracking-wide">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

          </SidebarMenu>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter className="border-t border-white/10 p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 
                bg-white/5 hover:bg-red-500/20 hover:scale-[1.02]
                text-red-400 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-semibold">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

      </div>
    </Sidebar>
  );
}