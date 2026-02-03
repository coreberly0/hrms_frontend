"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HRDashboardClient() {
  const [name, setName] = useState("");

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("name="));
    if (cookie) setName(cookie.split("=")[1]);
  }, []);

  return (
    <div className="p-6 space-y-6">
      
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Welcome back{ name ? `, ${name}` : "" }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage employees, attendance and company operations.
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            128
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today Attendance</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            96%
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            6
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button>View Employees</Button>
          <Button variant="secondary">Attendance</Button>
          <Button variant="outline">Add Employee</Button>
        </CardContent>
      </Card>

    </div>
  );
}
