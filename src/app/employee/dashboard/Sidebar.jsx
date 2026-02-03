"use client"

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
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Attendance", icon: CalendarCheck },
    { name: "Payslip", icon: FileText },
    { name: "Leave", icon: Plane },
    { name: "Complaints", icon: MessageSquare },
    { name: "Profile", icon: User },
  ]

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#1C225B] text-white flex flex-col">

      {/* Title */}
      <div className="px-6 py-5 text-xl font-bold border-b border-white/20">
        Employee Portal
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/20 transition"
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </div>
          )
        })}
      </div>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-white/20">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/20">
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>

    </div>
  )
}