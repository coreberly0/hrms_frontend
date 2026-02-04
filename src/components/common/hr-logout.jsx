"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function HrLogout() {
  const router = useRouter();
  const pathname = usePathname();

  // 👉 extract hrId from /hr/hr1/...
  const hrId = pathname.split("/")[2];

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hrId) return;

    async function fetchHr() {
      try {
        const res = await fetch(`/api/hr/${hrId}`);
        if (!res.ok) throw new Error("Failed to load HR");
        const data = await res.json();
        setName(data.name);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchHr();
  }, [hrId]);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "hrId=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";

    router.push("/login");
  };

  return (
    <div className="ml-auto">
      {loading ? (
        <Skeleton className="h-9 w-32 rounded-md" />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="hidden md:block font-medium">
                {name}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
