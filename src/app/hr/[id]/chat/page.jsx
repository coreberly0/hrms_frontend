"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function HRChatPage() {
  const pathname = usePathname();
  const [hrId, setHrId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const match = pathname.match(/\/hr\/([^/]+)/);
    if (match) {
      setHrId(match[1]);
    }
  }, [pathname]);

  if (!mounted || !hrId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] overflow-hidden rounded-xl">
      <ChatInterface currentUserId={hrId} userRole="hr" />
    </div>
  );
}
