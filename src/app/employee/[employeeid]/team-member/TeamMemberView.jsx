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

import { Spinner } from "@/components/ui/spinner";

import {
  Mail,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  User,
  Phone,
  Calendar,
} from "lucide-react";

export default function TeamMemberView({
  open,
  onClose,
  member,
  loading,
  width = "95%",
  maxWidth = "1300px",
}) {
  // ✅ FIX: don't block dialog (prevents Radix error)
  if (!open) return null;

  const statusColor =
    member?.status === "Active"
      ? "bg-green-500"
      : member?.status === "Inactive"
      ? "bg-gray-400"
      : "bg-yellow-400";

  const joinDateFormatted = member?.joining_date
    ? new Date(member.joining_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="relative fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        bg-gradient-to-br from-gray-100 to-gray-200 
        dark:from-gray-900 dark:to-gray-800
        rounded-3xl p-8 shadow-2xl border"
        style={{ width, maxWidth }}
      >
        {/* ✅ Spinner (same UI, no change) */}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/40 rounded-3xl">
            <Spinner className="h-10 w-10" />
          </div>
        )}

        {/* HEADER (always present → fixes error) */}
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center tracking-tight">
            Team Member Profile
          </DialogTitle>
        </DialogHeader>

        <Separator className="my-5" />

        {/* PROFILE */}
        <div className="flex flex-col sm:flex-row items-center gap-6 
        bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border">

          <Avatar className="h-28 w-28 ring-4 ring-indigo-500 shadow-md">
            <AvatarFallback className="text-5xl font-semibold">
              {member?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2 flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold tracking-tight">
              {member?.name}
            </h2>

            <p className="flex items-center gap-2 text-sm text-muted-foreground justify-center sm:justify-start">
              <Mail size={15} /> {member?.email || "-"}
            </p>

            <div className="flex gap-2 flex-wrap justify-center sm:justify-start mt-2">
              <Badge className={`${statusColor} text-white px-3 py-1 rounded-full shadow-sm`}>
                {member?.status || "Active"}
              </Badge>

              <Badge variant="outline" className="px-3 py-1 rounded-full">
                {member?.position || "-"}
              </Badge>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold mb-4">Quick Info</h3>

            <div className="space-y-4 text-sm">
              {[
                { label: "Employee ID", value: member?.employee_id },
                { label: "Department", value: member?.department || "-" },
                { label: "Manager", value: member?.role || "-" },
                { label: "Join Date", value: joinDateFormatted },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1 border-b pb-2 last:border-none">
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-8">
            <Tabs defaultValue="job-info" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border overflow-hidden">

              <TabsList className="grid grid-cols-4 bg-gray-100 dark:bg-gray-700 p-1">
                <TabsTrigger value="job-info">Job</TabsTrigger>
                <TabsTrigger value="personal-info">Personal</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="extra">Extra</TabsTrigger>
              </TabsList>

              <TabsContent value="job-info" className="p-6">
                <div className="grid grid-cols-2 gap-5">
                  <InfoItem icon={<Briefcase size={16} />} label="Position" value={member?.position} />
                  <InfoItem icon={<Users size={16} />} label="Department" value={member?.department} />
                  <InfoItem icon={<User size={16} />} label="Manager" value={member?.role} />
                  <InfoItem icon={<DollarSign size={16} />} label="Salary" value={`₹ ${member?.salary || "-"}`} />
                </div>
              </TabsContent>

              <TabsContent value="personal-info" className="p-6">
                <div className="grid grid-cols-2 gap-5">
                  <InfoItem icon={<User size={16} />} label="Gender" value={member?.gender} />
                  <InfoItem icon={<Phone size={16} />} label="Phone" value={member?.phone} />
                  <InfoItem icon={<Mail size={16} />} label="Email" value={member?.email} />
                </div>
              </TabsContent>

              <TabsContent value="address" className="p-6">
                <div className="flex gap-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border">
                  <MapPin size={18} />
                  {member?.address || "No address"}
                </div>
              </TabsContent>

              <TabsContent value="extra" className="p-6">
                <div className="grid grid-cols-2 gap-5">
                  <InfoItem icon={<Users size={16} />} label="Status" value={member?.status} />
                  <InfoItem icon={<Calendar size={16} />} label="Join Date" value={joinDateFormatted} />
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* CARD */
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border">
      <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value || "-"}</p>
      </div>
    </div>
  );
}