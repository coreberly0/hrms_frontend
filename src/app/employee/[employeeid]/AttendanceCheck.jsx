"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";    
import { LogIn, LogOut } from "lucide-react";
import { checkIn, checkOut, getMyAttendance } from "@/services/attendanceService";

export default function AttendanceCheck() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [attendanceCompleted, setAttendanceCompleted] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate duration
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
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, [clockInTime, clockOutTime]);

  // Format time in IST
  const formatTimeIST = (date) => {
    if (!date) return "--:--";
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  // Load today's attendance
  const loadAttendance = async () => {
    try {
      const data = await getMyAttendance();
      const todayStr = new Date().toISOString().split("T")[0];
      const todayRecord = data.find(d => d.date?.split("T")[0] === todayStr);

      if (!todayRecord) {
        setIsClockedIn(false);
        setAttendanceCompleted(false);
        setClockInTime(null);
        setClockOutTime(null);
        return;
      }

      if (todayRecord.check_in) {
        setClockInTime(new Date(`${todayStr}T${todayRecord.check_in}`));
        setIsClockedIn(!todayRecord.check_out);
      }

      if (todayRecord.check_out) {
        setClockOutTime(new Date(`${todayStr}T${todayRecord.check_out}`));
        setIsClockedIn(false);
        setAttendanceCompleted(true);
      }
    } catch (err) {
      console.error("Failed to load attendance:", err);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  // Clock In
  const handleClockIn = async () => {
    try {
      await checkIn();
      await loadAttendance();
    } catch (err) {
      alert(err.message);
    }
  };

  // Clock Out
  const handleClockOut = async () => {
    try {
      await checkOut();
      await loadAttendance();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Attendance</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">Current Time</p>
              <h2 className="text-2xl font-bold">{formatTimeIST(currentTime)}</h2>
            </div>
            <Badge className={attendanceCompleted ? "bg-blue-600" : isClockedIn ? "bg-green-600" : "bg-gray-400"}>
              {attendanceCompleted ? "COMPLETED" : isClockedIn ? "IN" : "OUT"}
            </Badge>
          </div>

          <div className="grid grid-cols-3 text-center mb-3">
            <div>
              <p className="text-sm">IN</p>
              <p className="text-sm">{clockInTime ? formatTimeIST(clockInTime) : "--:--"}</p>
            </div>
            <div>
              <p className="text-sm">OUT</p>
              <p className="text-sm">{clockOutTime ? formatTimeIST(clockOutTime) : "--:--"}</p>
            </div>
            <div>
              <p className="text-sm">HOURS</p>
              <p className="text-sm">{duration ? `${duration.hours}h ${duration.minutes}m` : "--"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleClockIn} disabled={isClockedIn || attendanceCompleted} className="flex-1 bg-green-600 hover:bg-green-700">
              <LogIn className="h-4 w-4 mr-2"/> Clock In
            </Button>
            <Button onClick={handleClockOut} disabled={!isClockedIn} className="flex-1 bg-red-600 hover:bg-red-700">
              <LogOut className="h-4 w-4 mr-2"/> Clock Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}