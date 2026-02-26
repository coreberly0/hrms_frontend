"use client";

import { useEffect, useState } from "react";
import { getEmployeeById } from "@/services/employee";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Mail,
  Phone,
  Briefcase,
  IndianRupee,
  Calendar,
  MapPin,
} from "lucide-react";

export default function EmployeeProfileDashboard({ employeeid }) {
  const [emp, setEmp] = useState(null);

  useEffect(() => {
    if (!employeeid) return;
    getEmployeeById(employeeid).then(setEmp);
  }, [employeeid]);

  if (!emp) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">

        {/* ===== LEFT CONTENT ===== */}
        <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 space-y-8">

          <Section title="Personal Details">
            <Row icon={Mail} label="Email" value={emp.email} />
            <Row icon={Phone} label="Phone" value={emp.personal_phone} />
            <Row label="Gender" value={emp.gender} />
            <Row label="Marital Status" value={emp.marital_status} />
          </Section>

          <Section title="Employment Information">
            <Row icon={Briefcase} label="Role" value={emp.role} />
            <Row icon={IndianRupee} label="Salary" value={`₹ ${emp.salary}`} />
            <Row icon={Calendar} label="Joining Date" value={emp.joining_date} />
          </Section>

          <Section title="Address">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-1" />
              <p>
                {emp.door_no}, {emp.street}, {emp.area}, <br />
                {emp.city}, {emp.state} - {emp.pincode}
              </p>
            </div>
          </Section>

        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-6 sm:p-8 flex flex-col items-center text-center space-y-6">

          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white">
            <AvatarFallback className="text-3xl font-bold bg-slate-700">
              {emp.name?.[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              {emp.name}
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              {emp.position}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              ID: {emp.employee_id}
            </p>
          </div>

          <Badge className="bg-green-500 text-white px-4 py-1">
            {emp.status}
          </Badge>

          <Separator className="bg-slate-700 w-full" />

          <div className="text-sm text-slate-300 space-y-2">
            <p>{emp.department}</p>
            <p>{emp.company_name}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

/* ===== SECTION ===== */
function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ===== ROW ===== */
function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex justify-between items-center border-b pb-2 text-sm gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </div>
      <span className="font-medium text-right break-all">
        {value || "-"}
      </span>
    </div>
  );
}