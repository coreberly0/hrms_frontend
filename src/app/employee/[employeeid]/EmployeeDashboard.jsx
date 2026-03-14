"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Clock,
  LogIn,
  LogOut,
  Sparkles,
  Coffee,
  CheckCircle,
  ListTodo,
  Award,
  TrendingUp
} from "lucide-react";

import { getEmployeeById } from "@/services/employee";

/* ✅ FIXED IMPORT */
import {
  getMyAttendance,
  checkIn,
  checkOut
} from "@/services/attendanceService";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import HRAnalytics from "@/components/dashboard/HRAnalytics";
import ManagerAnalytics from "@/components/dashboard/ManagerAnalytics";

export default function EmployeeDashboard({ employeeid }) {

  const [mounted, setMounted] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [attendanceCompleted, setAttendanceCompleted] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [duration, setDuration] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [employeeFromAPI, setEmployeeFromAPI] = useState(null);

  /* =========================
     FIX HYDRATION
  ========================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =========================
     LIVE CLOCK
  ========================= */

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  /* =========================
     CALCULATE WORK HOURS
  ========================= */

  useEffect(() => {

    if (!clockInTime) return;

    const updateDuration = () => {

      const start = new Date(clockInTime);
      const end = clockOutTime ? new Date(clockOutTime) : new Date();

      const diff = end - start;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setDuration({ hours, minutes });

    };

    updateDuration();

    const timer = setInterval(updateDuration, 1000);

    return () => clearInterval(timer);

  }, [clockInTime, clockOutTime]);

  /* =========================
     LOAD ATTENDANCE FROM DB
  ========================= */

  useEffect(() => {

    const loadAttendance = async () => {

      try {

        const response = await getMyAttendance();

        if (!response || response.length === 0) return;

        const data = response[0];

        const today = new Date().toISOString().split("T")[0];
        const recordDate = data.date?.split("T")[0];   // ✅ FIXED

        if (today !== recordDate) return;

        const dateOnly = recordDate;

        if (data.check_in) {

          const inDateTime = new Date(`${dateOnly}T${data.check_in}`);

          setClockInTime(inDateTime);
          setIsClockedIn(!data.check_out);

        }

        if (data.check_out) {

          const outDateTime = new Date(`${dateOnly}T${data.check_out}`);

          setClockOutTime(outDateTime);
          setIsClockedIn(false);
          setAttendanceCompleted(true);

        }

      } catch (err) {

        console.log("Attendance Load Error:", err);

      }

    };

    if (mounted) loadAttendance();

  }, [mounted]);

  /* =========================
     FETCH EMPLOYEE
  ========================= */

  useEffect(() => {

    const fetchEmployee = async () => {

      const data = await getEmployeeById(employeeid);

      if (data) setEmployee(data);

    };

    if (mounted) fetchEmployee();

  }, [employeeid, mounted]);

  /* =========================
     FETCH ROLE
  ========================= */

  useEffect(() => {

    const fetchEmployeeFromAPI = async () => {

      try {

        const res = await fetch(`/api/employees/${employeeid}`);

        if (res.ok) {

          const data = await res.json();
          setEmployeeFromAPI(data[0] || data);

        }

      } catch (err) {

        console.log(err);

      }

    };

    if (mounted && employeeid) fetchEmployeeFromAPI();

  }, [employeeid, mounted]);

  /* =========================
     CLOCK IN
  ========================= */

  const handleClockIn = async () => {

    try {

      await checkIn();

      const now = new Date();

      setClockInTime(now);
      setClockOutTime(null);
      setIsClockedIn(true);
      setAttendanceCompleted(false);

    } catch (err) {

      alert(err.message);

    }

  };

  /* =========================
     CLOCK OUT
  ========================= */

  const handleClockOut = async () => {

    try {

      await checkOut();

      const now = new Date();

      setClockOutTime(now);
      setIsClockedIn(false);
      setAttendanceCompleted(true);

    } catch (err) {

      alert(err.message);

    }

  };

  /* =========================
     FORMAT TIME
  ========================= */

  const formatTime = (date) => {

    if (!date) return "--:--";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

  };

  return (

    <div className="p-3 space-y-4">

      {/* FIRST ROW */}

      <div className="flex gap-4 w-full">

        {/* LEFT GREETING */}

        <div className="w-1/2">

          <Card className="border-0 shadow-md bg-linear-to-br from-primary-50 to-primary-100 h-full">

            <CardContent className="p-4">

              <h2 className="text-3xl font-bold flex items-center gap-2">
                Welcome back! 👋
              </h2>

              <p className="text-2xl font-bold text-primary-700 mt-2">
                {employeeFromAPI?.employeeName || employee?.name || ""}
              </p>

            </CardContent>

          </Card>

        </div>

        {/* CLOCK SECTION */}

        <div className="w-1/2">

          <Card className="border-0 shadow-md bg-white h-full">

            <CardContent className="p-3">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-sm text-gray-500">Current Time</p>

                  <p className="text-2xl font-bold">
                    {mounted ? formatTime(currentTime) : "--:--"}
                  </p>

                </div>

                <Badge className={
                  attendanceCompleted
                    ? "bg-blue-600"
                    : isClockedIn
                    ? "bg-green-600"
                    : "bg-gray-400"
                }>

                  {attendanceCompleted
                    ? "COMPLETED"
                    : isClockedIn
                    ? "IN"
                    : "OUT"}

                </Badge>

              </div>

              <div className="grid grid-cols-3 gap-3 text-center mt-3">

                <div>
                  <p className="text-xs">IN</p>
                  <p className="font-semibold">
                    {clockInTime ? formatTime(clockInTime) : "--:--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs">OUT</p>
                  <p className="font-semibold">
                    {clockOutTime ? formatTime(clockOutTime) : "--:--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs">HRS</p>
                  <p className="font-semibold">
                    {duration ? `${duration.hours}h ${duration.minutes}m` : "--"}
                  </p>
                </div>

              </div>

              <div className="flex gap-2 mt-3">

                <Button
                  onClick={handleClockIn}
                  disabled={isClockedIn || attendanceCompleted}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <LogIn className="h-4 w-4 mr-2"/>
                  Clock In
                </Button>

                <Button
                  onClick={handleClockOut}
                  disabled={!isClockedIn}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2"/>
                  Clock Out
                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

      {/* ROLE BASED ANALYTICS */}

      {(() => {

        const empData = employeeFromAPI || employee;
        const role = empData?.role ? empData.role.toLowerCase().trim() : "";

        if (role === "hr") return <HRAnalytics />;
        if (role === "manager") return <ManagerAnalytics />;

        return null;

      })()}

      
            {/* Second Row - Analytics */}
            {(() => {
              const empData = employeeFromAPI || employee;
              const role = empData?.role ? empData.role.toLowerCase().trim() : "";
      
              if (role === "hr") {
                return <HRAnalytics />;
              }
      
              if (role === "manager") {
                return <ManagerAnalytics />;
              }
      
              return (
            <div className="flex gap-4 w-full">
              
              {/* Task & Productivity */}
              <div className="w-1/2">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5 text-primary-600" />
                      <div>
                        <CardTitle className="text-base font-semibold">Task & Productivity</CardTitle>
                        <CardDescription className="text-xs">Track your task completion and productivity</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Task Stats Grid */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-gray-50 p-2 rounded text-center border">
                        <p className="text-xs text-gray-600 font-medium">Total</p>
                        <p className="text-xl font-bold text-gray-900">15</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center border">
                        <p className="text-xs text-gray-600 font-medium">Done</p>
                        <p className="text-xl font-bold text-gray-900">10</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center border">
                        <p className="text-xs text-gray-600 font-medium">Pending</p>
                        <p className="text-xl font-bold text-gray-900">3</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center border">
                        <p className="text-xs text-gray-600 font-medium">Overdue</p>
                        <p className="text-xl font-bold text-gray-900">2</p>
                      </div>
                    </div>
      
                    {/* Pie Chart */}
                    <div className="h-64 flex items-center justify-center">
                      <ChartContainer
                        config={{
                          done: { label: "Done", color: "#000000" },
                          pending: { label: "Pending", color: "#666666" },
                          overdue: { label: "Overdue", color: "#999999" },
                        }}
                        className="h-full w-full"
                      >
                        <PieChart>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Pie
                            data={[
                              { name: "Done", value: 10, fill: "#000000" },
                              { name: "Pending", value: 3, fill: "#666666" },
                              { name: "Overdue", value: 2, fill: "#999999" },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            dataKey="value"
                          />
                        </PieChart>
                      </ChartContainer>
                    </div>
      
                    {/* Bottom Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-600">Completion Rate</p>
                        <p className="text-lg font-bold text-gray-900">67%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Avg. Completion</p>
                        <p className="text-lg font-bold text-gray-900">2.5 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
      
              {/* Performance & Goals */}
              <div className="w-1/2">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary-600" />
                      <div>
                        <CardTitle className="text-base font-semibold">Performance & Goals</CardTitle>
                        <CardDescription className="text-xs">Your performance metrics and goal progress</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Performance Stats Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 p-2 rounded text-center border">
                        <p className="text-xs text-gray-600 font-medium">Score</p>
                        <p className="text-xl font-bold text-gray-900">87</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center border">
                        <p className="text-xs text-gray-600 font-medium">KPI %</p>
                        <p className="text-xl font-bold text-gray-900">92</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center border">
                        <p className="text-xs text-gray-600 font-medium">Goals</p>
                        <p className="text-xl font-bold text-gray-900">8/10</p>
                      </div>
                    </div>
      
                    {/* Bar Chart */}
                    <div className="h-64">
                      <ChartContainer
                        config={{
                          score: { label: "Score", color: "#000000" },
                        }}
                        className="h-full w-full"
                      >
                        <BarChart
                          data={[
                            { month: "Sep", score: 78 },
                            { month: "Oct", score: 82 },
                            { month: "Nov", score: 85 },
                            { month: "Dec", score: 83 },
                            { month: "Jan", score: 88 },
                            { month: "Feb", score: 87 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            domain={[0, 100]}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="score" fill="#000000" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </div>
      
                    {/* Bottom Text */}
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>+5 points improvement from last month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
              );})()}

    </div>
  );
}