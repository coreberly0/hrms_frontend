"use client";

import { EmpSidebar } from '@/components/common/emp-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getEmployeeById } from '@/services/employee'
import { User, Briefcase, Building2, Hash } from 'lucide-react'

export default function Layout({children}) {
  const pathname = usePathname()
  const [employee, setEmployee] = useState(null)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  // Extract employeeid from pathname
  useEffect(() => {
    const fetchEmployee = async () => {
      const match = pathname.match(/\/employee\/([^/]+)/)
      if (match) {
        const employeeid = match[1]
        const data = await getEmployeeById(employeeid)
        if (data) {
          setEmployee(data)
        }
      }
    }

    if (mounted) {
      fetchEmployee()
    }
  }, [pathname, mounted])

  return (
    <SidebarProvider>
        <EmpSidebar />

      <main className="w-full p-4">
        <div className="flex items-center justify-between mb-4">
          <SidebarTrigger />
          
          {/* Avatar with Dropdown */}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar size="lg" className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage src={employee?.profile_image || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {employee?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-4">
              <div className="space-y-4">
                {/* Header with Avatar */}
                <div className="flex items-center gap-3 pb-3 border-b">
                  <Avatar size="lg">
                    <AvatarImage src={employee?.profile_image || "#"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {employee?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{employee?.name || "Loading..."}</h3>
                    <p className="text-xs text-muted-foreground">{employee?.email || "#"}</p>
                  </div>
                </div>
                
                {/* Employee Details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">{employee?.name || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Employee ID</p>
                      <p className="text-sm font-medium">{employee?.employee_id || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{employee?.department || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-medium">{employee?.position || employee?.role || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        </div>

        {children}
      </main>
    </SidebarProvider>
  )
}
