"use client";

import { EmpSidebar } from '@/components/common/emp-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getEmployeeById } from '@/services/employee'
import { User, Briefcase, Building2, Hash } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Layout({children}) {
  const pathname = usePathname()
  const [employee, setEmployee] = useState(null)
  const [employeeFromAPI, setEmployeeFromAPI] = useState(null)
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
        
        // Fetch from local API first
        try {
          const res = await fetch(`/api/employees/${employeeid}`)
          if (res.ok) {
            const data = await res.json()
            const empData = data[0] || data
            setEmployeeFromAPI(empData)
          }
        } catch (err) {
          console.log("Error fetching from local API:", err.message)
        }
        
        // Also fetch from external API
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

  // Merge employee data - prefer local API data
  const empData = employeeFromAPI || employee

  return (
    <SidebarProvider>
        <EmpSidebar />

      <main className="w-full p-4">
        <div className="flex items-center justify-between mb-2">
          <SidebarTrigger />
          
          {/* Avatar with Dropdown */}
          {mounted && (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar size="lg" className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                      <AvatarImage src={empData?.profile_image || empData?.profileImage || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {empData?.name?.[0] || empData?.employeeName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-4">
                <div className="space-y-4">
                  {/* Header with Avatar */}
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <Avatar size="lg">
                      <AvatarImage src={empData?.profile_image || empData?.profileImage || "#"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {empData?.name?.[0] || empData?.employeeName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{empData?.employeeName || empData?.name || "Loading..."}</h3>
                      <p className="text-xs text-muted-foreground">{empData?.email || "#"}</p>
                    </div>
                  </div>
                  
                  {/* Employee Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="text-sm font-medium">{empData?.employeeName || empData?.name || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Employee ID</p>
                        <p className="text-sm font-medium">{empData?.employeeCode || empData?.employee_id || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="text-sm font-medium">{empData?.department || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Role</p>
                        <p className="text-sm font-medium">{empData?.designation || empData?.position || empData?.role || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          )}
        </div>

        {children}
      </main>
    </SidebarProvider>
  )
}