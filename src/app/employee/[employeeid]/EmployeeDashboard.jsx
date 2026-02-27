"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, LogIn, LogOut, Sparkles, Coffee, CheckCircle, ListTodo, Award, TrendingUp } from "lucide-react";
import { getEmployeeById } from "@/services/employee";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function EmployeeDashboard({ employeeid }) {
  const [mounted, setMounted] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [duration, setDuration] = useState(null);
  const [employee, setEmployee] = useState(null);


  // Set mounted flag to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate duration
  useEffect(() => {
    if (!clockInTime) return;

    const updateDuration = () => {
      const endTime = clockOutTime || new Date();
      const diff = endTime - clockInTime;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setDuration({ hours, minutes, seconds });
    };

    updateDuration();
    const timer = setInterval(updateDuration, 1000);
    return () => clearInterval(timer);
  }, [clockInTime, clockOutTime, isClockedIn]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedClockIn = localStorage.getItem(`clockIn_${employeeid}`);
    const savedClockOut = localStorage.getItem(`clockOut_${employeeid}`);
    const savedStatus = localStorage.getItem(`clockStatus_${employeeid}`);

    if (savedClockIn) setClockInTime(new Date(savedClockIn));
    if (savedClockOut) setClockOutTime(new Date(savedClockOut));
    if (savedStatus === "in") setIsClockedIn(true);
  }, [employeeid]);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      const data = await getEmployeeById(employeeid);
      if (data) {
        setEmployee(data);
      }
    };

    if (mounted) {
      fetchEmployee();
    }
  }, [employeeid, mounted]);

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    setClockOutTime(null);
    setIsClockedIn(true);
    
    localStorage.setItem(`clockIn_${employeeid}`, now.toISOString());
    localStorage.setItem(`clockStatus_${employeeid}`, "in");
    localStorage.removeItem(`clockOut_${employeeid}`);
  };

  const handleClockOut = () => {
    const now = new Date();
    setClockOutTime(now);
    setIsClockedIn(false);
    
    localStorage.setItem(`clockOut_${employeeid}`, now.toISOString());
    localStorage.setItem(`clockStatus_${employeeid}`, "out");
  };

  const formatTime = (date) => {
    if (!date) return "--:--:--";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-3 space-y-4">
      {/* First Row - Greeting & Clock */}
      <div className="flex gap-4 w-full">
        
        {/* Left Side - Greeting Section */}
        <div className="w-1/2">
          <Card className="border-0 shadow-md bg-linear-to-br from-primary-50 to-primary-100 h-full">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Welcome Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                      Welcome back! 👋
                    </h2>
                    <p className="text-2xl font-bold text-primary-700 mt-2">
                      {employee?.name || "Employee"}
                    </p>
                  </div>
                  <Sparkles className="h-8 w-8 text-primary-600 shrink-0" />
                </div>

                {/* Status Message */}
                <div className="pt-2">
                  {isClockedIn ? (
                    <div className="flex items-center gap-2 text-primary-700 bg-primary-100 px-3 py-2 rounded-lg">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">You're all set! Keep up the good work 💪</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-primary-700 bg-primary-100 px-3 py-2 rounded-lg">
                      <Coffee className="h-5 w-5" />
                      <span className="text-sm font-medium">Ready to start your day? Click clock in ☕</span>
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="space-y-2 pt-3 border-t border-primary-200">
                  <div className="text-sm">
                    <p className="text-gray-600">Today's Goal</p>
                    <p className="font-semibold text-gray-900">8 hours of focused work</p>
                  </div>
                </div>

                {/* Motivational Quote */}
                <div className="bg-white bg-opacity-60 px-3 py-2 rounded-lg border border-primary-200 text-center">
                  <p className="text-xs italic text-gray-700">
                    "Every hour at work is an opportunity to grow! 🚀"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Clock In/Out Section */}
        <div className="w-1/2">
          
          {/* Compact Clock Card */}
          <Card className="border-0 shadow-md bg-white h-full">
            <CardContent className="p-3">
              {/* Time Display & Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Current Time</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mounted ? formatTime(currentTime) : "--:--:--"}
                    </p>
                  </div>
                </div>
                <Badge 
                  className={`text-xs px-2 py-0.5 ${isClockedIn ? "bg-primary-600 hover:bg-primary-700" : "bg-primary-300"}`}
                >
                  {isClockedIn ? "In" : "Out"}
                </Badge>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="p-1.5 bg-primary-100 rounded border border-primary-300">
                  <p className="text-xs text-primary-700 font-semibold">IN</p>
                  <p className="text-sm font-semibold text-primary-900">
                    {clockInTime ? clockInTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                  </p>
                </div>
                <div className="p-1.5 bg-primary-200 rounded border border-primary-400">
                  <p className="text-xs text-primary-700 font-semibold">OUT</p>
                  <p className="text-sm font-semibold text-primary-900">
                    {clockOutTime ? clockOutTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                  </p>
                </div>
                <div className="p-1.5 bg-primary-300 rounded border border-primary-500">
                  <p className="text-xs text-primary-700 font-semibold">HRS</p>
                  <p className="text-sm font-semibold text-primary-900">
                    {duration ? `${duration.hours}h ${duration.minutes}m` : "--"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleClockIn}
                  disabled={isClockedIn}
                  size="sm"
                  className="flex-1 gap-1 bg-green-600 hover:bg-green-700 text-white text-sm h-8"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Clock In
                </Button>
                <Button
                  onClick={handleClockOut}
                  disabled={!isClockedIn}
                  size="sm"
                  className="flex-1 gap-1 bg-red-600 hover:bg-red-700 text-white text-sm h-8"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Clock Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Second Row - Analytics */}
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

    </div>
  );
}