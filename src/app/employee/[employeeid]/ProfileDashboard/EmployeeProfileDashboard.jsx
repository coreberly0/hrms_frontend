"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmployeeById } from "@/services/employee";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  Mail,
  Phone,
  Briefcase,
  IndianRupee,
  Calendar,
  MapPin,
  Pencil,
} from "lucide-react";

export default function EmployeeProfileDashboard({ employeeid }) {
  const router = useRouter();
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try local API first
        try {
          const res = await fetch(`/api/employees/${employeeid}`);
          if (res.ok) {
            const data = await res.json();
            const empData = Array.isArray(data) ? data[0] : data;
            if (empData) {
              setEmp(empData);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.log("Local API error:", err);
        }

        // Fallback to external API
        const externalData = await getEmployeeById(employeeid);
        if (externalData) {
          setEmp(externalData);
        }
      } finally {
        setLoading(false);
      }
    };

    if (employeeid) {
      fetchData();
    }
  }, [employeeid]);

  // Handle Edit click
  const handleEdit = () => {
    localStorage.setItem(`profileEditMode_${employeeid}`, "true");
    router.push(`/employee/${employeeid}/profile-form`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!emp) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Employee not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* Edit Button — top right */}
      <div className="max-w-6xl mx-auto mb-3 flex justify-end">
        <Button
          onClick={handleEdit}
          variant="outline"
          className="flex items-center gap-2 text-[#1C225B] border-[#1C225B] hover:bg-[#1C225B] hover:text-white transition-colors"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 space-y-8">

          {/* Only fields that have API IDs — same as original */}
          <Section title="Personal Details">
            <Row icon={Mail} label="Email" value={emp.email} />
            <Row icon={Phone} label="Phone" value={emp.personal_phone || emp.personalPhone} />
            <Row label="Gender" value={emp.gender} />
            <Row label="Marital Status" value={emp.marital_status || emp.maritalStatus} />
          </Section>

          <Section title="Employment Information">
            <Row icon={Briefcase} label="Role" value={emp.role || emp.position || emp.designation} />
            <Row icon={IndianRupee} label="Salary" value={`₹ ${emp.salary}`} />
            <Row icon={Calendar} label="Joining Date" value={emp.joining_date || emp.joiningDate} />
          </Section>

          <Section title="Address">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-1" />
              <p>
                {emp.door_no || emp.address?.doorNo}, {emp.street || emp.address?.street}, {emp.area || emp.address?.area}, <br />
                {emp.city || emp.address?.city}, {emp.state || emp.address?.state} - {emp.pincode || emp.address?.pincode}
              </p>
            </div>
          </Section>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-6 sm:p-8 flex flex-col items-center text-center space-y-6">

          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white">
            <AvatarFallback className="text-3xl font-bold bg-slate-700">
              {(emp.name || emp.employeeName)?.[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              {emp.name || emp.employeeName}
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              {emp.position || emp.designation || emp.role}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              ID: {emp.employee_id || emp.employeeCode}
            </p>
          </div>

          <Badge className="bg-green-500 text-white px-4 py-1">
            {emp.status}
          </Badge>

          <Separator className="bg-slate-700 w-full" />

          <div className="text-sm text-slate-300 space-y-2">
            <p>{emp.department}</p>
            <p>{emp.company_name || emp.companyName}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

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
