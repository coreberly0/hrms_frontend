"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  const pathname = usePathname();
  const [employeeId, setEmployeeId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const match = pathname.match(/\/employee\/([^/]+)/);
    if (match) {
      setEmployeeId(match[1]);
    }
  }, [pathname]);

  if (!mounted || !employeeId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] overflow-hidden rounded-xl">
      <ChatInterface currentUserId={employeeId} userRole="employee" />
    </div>
  );
}
