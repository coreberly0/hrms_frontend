"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, DollarSign, Briefcase, Users } from "lucide-react";

export default function EmployeeProfileDialog({
  open,
  onClose,
  employee,
  width = "90%",
  maxWidth = "1200px"
}) {
  if (!employee) return null;

  const statusColor =
    employee?.status === "Active"
      ? "bg-green-500"
      : employee?.status === "Inactive"
      ? "bg-gray-400"
      : "bg-yellow-400";

  // ✅ FIXED FIELD (your backend uses joining_date)
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
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl"
        style={{ width, maxWidth }}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Employee Profile
          </DialogTitle>
        </DialogHeader>

        <Separator className="my-4" />

        {/* TOP PROFILE */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
          <Avatar className="h-28 w-28 ring-2 ring-indigo-500">
            <AvatarFallback className="text-5xl">
              {employee?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2 flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold">{employee?.name}</h2>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={16} /> {employee?.email || "-"}
            </p>

            <div className="flex gap-2 flex-wrap">
              <Badge className={`${statusColor} text-white`}>
                {employee?.status || "Active"}
              </Badge>

              <Badge variant="outline">
                {employee?.position || "-"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* LEFT SIDE */}
          <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
            <h3 className="text-lg font-medium mb-2">Quick Info</h3>

            <div className="space-y-2 text-sm">
              <div><strong>ID:</strong> {employee?.employee_id}</div>
              <div><strong>Department:</strong> {employee?.department || "-"}</div>
              <div><strong>Manager:</strong> {employee?.role || "-"}</div>
              <div><strong>Join Date:</strong> {joinDateFormatted}</div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="md:col-span-8">
            <Tabs defaultValue="job-info" className="bg-white dark:bg-gray-800 rounded-2xl shadow-md">

              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="job-info">Job Info</TabsTrigger>
                <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="additional-info">Additional Info</TabsTrigger>
              </TabsList>

              {/* JOB */}
              <TabsContent value="job-info" className="p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><strong>Position:</strong> {employee?.position}</div>
                  <div><strong>Department:</strong> {employee?.department}</div>
                  <div><strong>Manager:</strong> {employee?.role}</div>
                  <div><strong>Salary:</strong> ₹ {employee?.salary}</div>
                </div>
              </TabsContent>

              {/* PERSONAL */}
              <TabsContent value="personal-info" className="p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><strong>Gender:</strong> {employee?.gender}</div>
                  <div><strong>Marital Status:</strong> {employee?.marital_status}</div>
                  <div><strong>Phone:</strong> {employee?.personal_phone}</div>
                  <div><strong>Alt Phone:</strong> {employee?.alternate_phone}</div>
                </div>
              </TabsContent>

              {/* ADDRESS */}
              <TabsContent value="address" className="p-4">
                <p className="text-sm">
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
                </p>
              </TabsContent>

              {/* EXTRA */}
              <TabsContent value="additional-info" className="p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><strong>Company:</strong> {employee?.company_name}</div>
                  <div><strong>Status:</strong> {employee?.status}</div>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}