"use client"

import { useRouter, usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  CalendarCheck, 
  FileText, 
  Plane, 
  MessageSquare, 
  User, 
  LogOut 
} from "lucide-react"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/employee/dashboard" },
    { name: "Attendance", icon: CalendarCheck, path: "/employee/attendance" },
    { name: "Payslip", icon: FileText, path: "/employee/payslip" },
    { name: "Leave", icon: Plane, path: "/employee/leave" },
    { name: "Complaints", icon: MessageSquare, path: "/employee/complaints" },
    { name: "Profile", icon: User, path: "/employee/profile" },
  ]

  const handleNavigation = (path) => {
    router.push(path)
  }

  const handleLogout = () => {
    // Logout logic - localStorage clear, session clear, etc.
    // localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#1C225B] text-white flex flex-col">

      {/* Title */}
      <div className="px-6 py-5 text-xl font-bold border-b border-white/20">
        Employee Portal
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menu.map((item, i) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          
          return (
            <div
              key={i}
              onClick={() => handleNavigation(item.path)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all
                ${isActive 
                  ? 'bg-white/30 font-semibold shadow-lg' 
                  : 'hover:bg-white/10'
                }
              `}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="text-sm">{item.name}</span>
            </div>
          )
        })}
      </div>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-white/20">
        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-red-600 transition-all"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="text-sm">Logout</span>
        </div>
      </div>

    </div>
  )
}