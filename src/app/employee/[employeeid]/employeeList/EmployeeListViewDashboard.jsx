"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Mail, Phone, Calendar, MapPin, DollarSign, Briefcase, Users } from "lucide-react";

// Sample employee data
const employeeSample = {
  employee_id: 8,
  name: "Kishore",
  email: "kishorevijay0010@gmail.com",
  position: "Developer",
  salary: 50000,
  employee_code: "EMP8970",
  password: "$2b$10$L2nP5tkiokN323LZGHBWbOSBNSa0IrwGFeXwoZ6bI8eqsKNHpBH7a",
  manager: "Manager",
  leave_balance: 18,
  address_line1: "king street",
  area: "don area",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "600082",
  phone: "12345678",
  alt_phone: "87654321",
  gender: "Male",
  marital_status: "Single",
  join_date: "2026-02-27",
  core_department: "IT",
  it_department: "coreberly",
  status: "Active",
};

export default function EmployeeProfileDialog({ open, onClose, employee = employeeSample, width = "90%", maxWidth = "1200px" }) {
  if (!employee) return null;

  const statusColor =
    employee?.status === "Active"
      ? "bg-green-500"
      : employee?.status === "Inactive"
      ? "bg-gray-400"
      : "bg-yellow-400";

  // Format Join Date
  const joinDateFormatted = new Date(employee.join_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl"
        style={{ width, maxWidth, height: "auto" }}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
            Employee Profile
          </DialogTitle>
        </DialogHeader>

        <Separator className="my-4" />

        {/* TOP COMPACT PROFILE */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
          <Avatar className="h-28 w-28 ring-2 ring-indigo-500">
            <AvatarFallback className="text-5xl text-gray-700 dark:text-gray-200">
              {employee?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col sm:justify-center gap-2 flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{employee?.name}</h2>
            <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <Mail size={16} /> {employee?.email || "-"}
            </p>

            <div className="flex gap-2 mt-2 justify-center sm:justify-start flex-wrap">
              <Badge className={`${statusColor} text-white px-3 py-1 rounded-full`}>
                {employee?.status || "Active"}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 rounded-full">
                {employee?.position || "-"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT COLUMN STAYS COMPACT */}
          <div className="md:col-span-4 flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md sticky top-8">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Info</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div><strong>ID:</strong> {employee?.employee_id}</div>
              <div><strong>Department:</strong> {employee?.core_department || "-"}</div>
              <div><strong>Manager:</strong> {employee?.manager || "-"}</div>
              <div><strong>Join Date:</strong> {joinDateFormatted}</div>
            </div>
          </div>

          {/* RIGHT COLUMN - Tabs */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <Tabs defaultValue="job-info" className="bg-white dark:bg-gray-800 rounded-2xl shadow-md">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="job-info">Job Info</TabsTrigger>
                <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="additional-info">Additional Info</TabsTrigger>
              </TabsList>

              <TabsContent value="job-info" className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2"><Briefcase size={16} className="text-indigo-500" /> <strong>Position:</strong> {employee?.position}</div>
                  <div className="flex items-center gap-2"><Users size={16} className="text-indigo-500" /> <strong>Department:</strong> {employee?.core_department}</div>
                  <div className="flex items-center gap-2"><User size={16} className="text-indigo-500" /> <strong>Manager:</strong> {employee?.manager}</div>
                  <div className="flex items-center gap-2"><DollarSign size={16} className="text-indigo-500" /> <strong>Salary:</strong> ₹ {employee?.salary}</div>
                </div>
              </TabsContent>

              <TabsContent value="personal-info" className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div><strong>Gender:</strong> {employee?.gender}</div>
                  <div><strong>Marital Status:</strong> {employee?.marital_status}</div>
                  <div><strong>Phone:</strong> {employee?.phone}</div>
                  <div><strong>Alt Phone:</strong> {employee?.alt_phone}</div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="p-4">
                <p className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <MapPin size={16} className="text-indigo-500" /> {employee?.address_line1}, {employee?.area}, {employee?.city}
                </p>
                <p className="ml-6 text-gray-500 dark:text-gray-400 text-sm">
                  {employee?.state} - {employee?.pincode}
                </p>
              </TabsContent>

              <TabsContent value="additional-info" className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div><strong>Employee Code:</strong> {employee?.employee_code}</div>
                  <div><strong>Core Dept:</strong> {employee?.core_department}</div>
                  <div><strong>IT Dept:</strong> {employee?.it_department}</div>
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