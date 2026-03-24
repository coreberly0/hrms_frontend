"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  Mail,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  User,
  Phone,
} from "lucide-react";

export default function EmployeeProfileDialog({
  open,
  onClose,
  employee,
  width = "95%",
  maxWidth = "1300px",
}) {
  if (!employee) return null;

  const statusColor =
    employee?.status === "Active"
      ? "bg-green-500"
      : employee?.status === "Inactive"
      ? "bg-gray-400"
      : "bg-yellow-400";

  const joinDateFormatted = employee?.joining_date
    ? new Date(employee.joining_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        bg-gradient-to-br from-gray-100 to-gray-200 
        dark:from-gray-900 dark:to-gray-800
        rounded-3xl p-8 shadow-2xl border"
        style={{ width, maxWidth }}
      >
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center tracking-tight">
            Employee Profile
          </DialogTitle>
        </DialogHeader>

        <Separator className="my-5" />

        {/* PROFILE */}
        <div className="flex flex-col sm:flex-row items-center gap-6 
        bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border">

          <Avatar className="h-28 w-28 ring-4 ring-indigo-500 shadow-md">
            <AvatarFallback className="text-5xl font-semibold">
              {employee?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2 flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold tracking-tight">
              {employee?.name}
            </h2>

            <p className="flex items-center gap-2 text-sm text-muted-foreground justify-center sm:justify-start">
              <Mail size={15} /> {employee?.email || "-"}
            </p>

            <div className="flex gap-2 flex-wrap justify-center sm:justify-start mt-2">
              <Badge className={`${statusColor} text-white px-3 py-1 rounded-full shadow-sm`}>
                {employee?.status || "Active"}
              </Badge>

              <Badge variant="outline" className="px-3 py-1 rounded-full">
                {employee?.position || "-"}
              </Badge>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* LEFT PANEL */}
          <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold mb-4 tracking-tight">
              Quick Info
            </h3>

            <div className="space-y-4 text-sm">
              {[
                { label: "Employee ID", value: employee?.employee_id },
                { label: "Department", value: employee?.department || "-" },
                { label: "Manager", value: employee?.role || "-" },
                { label: "Join Date", value: joinDateFormatted },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 border-b pb-2 last:border-none"
                >
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:col-span-8">
            <Tabs
              defaultValue="job-info"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border overflow-hidden"
            >
              <TabsList className="grid grid-cols-4 bg-gray-100 dark:bg-gray-700 p-1">
                <TabsTrigger value="job-info">Job</TabsTrigger>
                <TabsTrigger value="personal-info">Personal</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="additional-info">Extra</TabsTrigger>
              </TabsList>

              {/* JOB */}
              <TabsContent value="job-info" className="p-6">
                <div className="grid grid-cols-2 gap-5 text-sm">
                  <InfoItem icon={<Briefcase size={16} />} label="Position" value={employee?.position} />
                  <InfoItem icon={<Users size={16} />} label="Department" value={employee?.department} />
                  <InfoItem icon={<DollarSign size={16} />} label="Salary" value={`₹ ${employee?.salary}`} />
                  <InfoItem icon={<Users size={16} />} label="Manager" value={employee?.role} />
                </div>
              </TabsContent>

              {/* PERSONAL */}
              <TabsContent value="personal-info" className="p-6">
                <div className="grid grid-cols-2 gap-5 text-sm">
                  <InfoItem icon={<User size={16} />} label="Gender" value={employee?.gender} />
                  <InfoItem icon={<User size={16} />} label="Marital Status" value={employee?.marital_status} />
                  <InfoItem icon={<Phone size={16} />} label="Phone" value={employee?.personal_phone} />
                  <InfoItem icon={<Phone size={16} />} label="Alt Phone" value={employee?.alternate_phone} />
                </div>
              </TabsContent>

              {/* ADDRESS */}
              <TabsContent value="address" className="p-6">
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border">
                  <MapPin size={18} className="text-indigo-500 mt-1" />
                  <div className="text-sm leading-relaxed">
                    {[
                      employee?.door_no,
                      employee?.street,
                      employee?.area,
                      employee?.city,
                      employee?.state,
                      employee?.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "No address"}
                  </div>
                </div>
              </TabsContent>

              {/* EXTRA */}
              <TabsContent value="additional-info" className="p-6">
                <div className="grid grid-cols-2 gap-5 text-sm">
                  <InfoItem icon={<Briefcase size={16} />} label="Company" value={employee?.company_name} />
                  <InfoItem icon={<Users size={16} />} label="Status" value={employee?.status} />
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* 🔥 REUSABLE ITEM */
function InfoItem({ icon, label, value }) {
  return (
    <div className="
      flex items-center gap-3 
      bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-gray-700 dark:to-gray-800
      p-4 rounded-xl border 
      hover:shadow-md hover:scale-[1.02] 
      transition-all duration-200
    ">
      <div className="
        h-9 w-9 flex items-center justify-center 
        rounded-lg bg-indigo-100 dark:bg-indigo-900
        text-indigo-600 dark:text-indigo-300
      ">
        {icon}
      </div>

      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground tracking-wide">
          {label}
        </span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {value || "-"}
        </span>
      </div>
    </div>
  );
}