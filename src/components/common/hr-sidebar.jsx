"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function HRSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="bg-gray-300 text-black">
      {/* Header */}
      <SidebarHeader className="text-xl font-bold px-4 py-3 border-b border-gray-400">
        HR Panel
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="space-y-1">

          {/* Dashboard */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/hr/dashboard"}
              className="flex items-center gap-3 px-4 py-2 rounded-md
                         hover:bg-gray-400
                         data-[active=true]:bg-gray-500"
            >
              <Link href="/hr/dashboard">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Employees */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/hr/dashboard/employees")}
              className="flex items-center gap-3 px-4 py-2 rounded-md
                         hover:bg-gray-400
                         data-[active=true]:bg-gray-500"
            >
              <Link href="/hr/dashboard/employees.jsx">
                <Users className="h-5 w-5" />
                <span>Employees</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Attendance */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/hr/attendance"}
              className="flex items-center gap-3 px-4 py-2 rounded-md
                         hover:bg-gray-400
                         data-[active=true]:bg-gray-500"
            >
              <Link href="/hr/attendance">
                <CalendarCheck className="h-5 w-5" />
                <span>Attendance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
