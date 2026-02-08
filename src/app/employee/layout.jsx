import { EmpSidebar } from '@/components/common/emp-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

export default function layout({children}) {
  return (
    <SidebarProvider>
        <EmpSidebar />

      <main className="w-full p-4">
        <div className="flex items-center gap-3 mb-4">
          <SidebarTrigger />
        </div>

        {children}
      </main>
    </SidebarProvider>
  )
}
