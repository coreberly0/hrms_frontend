"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Building2,
  User,
  ShieldCheck,
  Users,
  CalendarCheck,
} from "lucide-react";

export default function HrDashboard({ id }) {
  const [hr, setHr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    async function fetchHr() {
      try {
        const res = await fetch(`/api/hr/${id}`);
        if (!res.ok) throw new Error("HR not found");
        const data = await res.json();
        setHr(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchHr();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid sm:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <Card className="max-w-xl mx-auto mt-10 border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">Something went wrong</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!hr) return null;

  const dayLabel = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const dateLabel = currentDateTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeLabel = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* HERO HEADER */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Welcome back, {hr.name}
            </h1>
            <p className="mt-1 text-slate-600">Here&apos;s what&apos;s happening today.</p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-sm font-semibold text-slate-700">{dayLabel}</p>
            <p className="text-sm text-slate-600">{dateLabel}</p>
            <p className="text-lg font-bold tabular-nums text-slate-900">{timeLabel}</p>
          </div>
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="h-6 w-6" />}
          title="Employees"
          value="124"
        />
        <StatCard
          icon={<CalendarCheck className="h-6 w-6" />}
          title="Attendance Today"
          value="118"
        />
        <StatCard
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Access Level"
          value="Full HR"
        />
      </div>

      {/* ℹ️ DETAILS + ACTIONS */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* DETAILS */}
        <Card className="md:col-span-2 rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>HR Information</CardTitle>
            <CardDescription>Account & company details</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <InfoItem icon={<Mail />} label="Email" value={hr.email} />
            <InfoItem icon={<Building2 />} label="Company" value={hr.companyName} />
            <InfoItem icon={<User />} label="HR ID" value={hr.id} />
            <InfoItem icon={<ShieldCheck />} label="Role" value={hr.role} />
          </CardContent>
        </Card>

        {/* QUICK ACTIONS */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common HR tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button className="w-full">View Employees</Button>
            <Button variant="outline" className="w-full">
              Mark Attendance
            </Button>
            <Button variant="secondary" className="w-full">
              Company Settings
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function StatCard({ icon, title, value }) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="p-3 rounded-lg bg-muted">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="p-2 rounded-lg bg-muted">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
