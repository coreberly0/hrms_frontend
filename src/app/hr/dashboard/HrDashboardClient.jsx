"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HRDashboardClient() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div>
        
      </div>
      <h1 className="text-2xl font-bold">HR Dashboard</h1>

      <div className="mt-4 space-x-4">
        <Button
          onClick={() => router.push("/hr/dashboard/employees.jsx")}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Employees
        </Button>
       

        <button className="px-4 py-2 bg-zinc-200 rounded">
          Attendance
        </button>
      </div>
    </div>
  );
}
