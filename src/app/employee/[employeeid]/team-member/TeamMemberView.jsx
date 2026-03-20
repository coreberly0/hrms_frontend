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
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Users,
} from "lucide-react";

export default function TeamMemberView({
  open,
  onClose,
  member,
}) {
  if (!member) return null;

  const statusColor =
    member?.status === "Active"
      ? "bg-green-500"
      : member?.status === "Inactive"
      ? "bg-gray-400"
      : "bg-yellow-400";

  const joinDateFormatted = member?.join_date
    ? new Date(member.join_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl"
        style={{ width: "90%", maxWidth: "1100px" }}
      >
        {/* TITLE */}
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-center">
            Team Member Profile
          </DialogTitle>
        </DialogHeader>

        <Separator className="my-4" />

        {/* TOP PROFILE */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
          <Avatar className="h-24 w-24 ring-2 ring-blue-500">
            <AvatarFallback className="text-3xl">
              {member?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h2 className="text-xl font-semibold">
              {member?.name}
            </h2>

            <p className="flex items-center gap-2 text-sm text-muted-foreground justify-center sm:justify-start">
              <Mail size={16} /> {member?.email}
            </p>

            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
              <Badge className={`${statusColor} text-white`}>
                {member?.status || "Active"}
              </Badge>

              <Badge variant="outline">
                {member?.position || "Employee"}
              </Badge>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* LEFT SIDE */}
          <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
            <h3 className="text-lg font-medium mb-3">
              Quick Info
            </h3>

            <div className="space-y-2 text-sm">
              <div>
                <strong>ID:</strong> {member?.employee_id}
              </div>

              <div>
                <strong>Department:</strong>{" "}
                {member?.department || "-"}
              </div>

              <div>
                <strong>Manager:</strong>{" "}
                {member?.manager || "-"}
              </div>

              <div>
                <strong>Join Date:</strong>{" "}
                {joinDateFormatted}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE TABS */}
          <div className="md:col-span-8">
            <Tabs defaultValue="job" className="bg-white dark:bg-gray-800 rounded-2xl shadow-md">

              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="job">Job</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
              </TabsList>

              {/* JOB */}
              <TabsContent value="job" className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex gap-2 items-center">
                    <Briefcase size={16} />
                    <strong>Position:</strong> {member?.position}
                  </div>

                  <div className="flex gap-2 items-center">
                    <Users size={16} />
                    <strong>Department:</strong>{" "}
                    {member?.department}
                  </div>

                  <div className="flex gap-2 items-center">
                    <User size={16} />
                    <strong>Manager:</strong>{" "}
                    {member?.manager}
                  </div>
                </div>
              </TabsContent>

              {/* PERSONAL */}
              <TabsContent value="personal" className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex gap-2 items-center">
                    <Phone size={16} />
                    <strong>Phone:</strong>{" "}
                    {member?.phone || "-"}
                  </div>

                  <div>
                    <strong>Email:</strong> {member?.email}
                  </div>
                </div>
              </TabsContent>

              {/* ADDRESS */}
              <TabsContent value="address" className="p-4">
                <p className="flex gap-2 items-center text-sm">
                  <MapPin size={16} />
                  {member?.address || "No address available"}
                </p>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}