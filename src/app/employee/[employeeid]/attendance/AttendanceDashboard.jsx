"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getMyAttendance } from "@/services/attendanceService";
import { getEmployeeById } from "@/services/employee";
import { getMyLeaves } from "@/services/leaveService";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

import AttendancceMyleave from "./AttendancceMyleave";
import AttendanceleaveApproval from "./AttendanceleaveApproval";

/* ================= CONSTANTS ================= */

const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ================= HELPERS ================= */

const getDateKey = (y, m, d) =>
  `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

const toMidnight = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/* ================= STATUS LOGIC ================= */

function getStatus({
  log,
  leaveMap,
  isWeekend,
  dateKey,
  todayKey,
  today,
  joiningDate
}) {
  if (isWeekend) return null;

  const cellDate = new Date(dateKey);

  if (joiningDate && cellDate < joiningDate) return null;

  // 🔵 LEAVE FIRST
  if (leaveMap[dateKey]) return leaveMap[dateKey];

  // 🟢 PRESENT
  if (log?.status === "P" || log?.status === "Present") return "P";

  // 🔴 ABSENT
  if (log?.status === "A" || log?.status === "Absent") return "A";

  // AUTO ABSENT
  if (joiningDate && cellDate < today && dateKey !== todayKey) return "A";

  return null;
}

/* ================= MAIN COMPONENT ================= */

export default function AttendanceDashboard() {

  const { employeeid } = useParams();
  const today = new Date();

  const [logs, setLogs] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [joiningDate, setJoiningDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!employeeid) return;

    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [attendanceData, leavesData, emp] = await Promise.all([
          getMyAttendance(),
          getMyLeaves(),
          getEmployeeById(employeeid)
        ]);

        const logsFormatted = (attendanceData || []).map(r => ({
          date: r.date?.split("T")[0],
          status: r.status
        }));

        const join = emp?.joining_date
          ? toMidnight(new Date(emp.joining_date))
          : null;

        if (active) {
          setLogs(logsFormatted);
          setLeaves(leavesData || []);
          setJoiningDate(join);
        }

      } catch (err) {
        console.error("Fetch Error:", err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => { active = false };

  }, [employeeid]);

  /* ================= MAPS ================= */

  const logMap = useMemo(() => {
    const map = {};
    logs.forEach(l => map[l.date] = l);
    return map;
  }, [logs]);

  const leaveMap = useMemo(() => {
    const map = {};

    leaves.forEach(l => {
      if (l.status !== "Approved") return;

      const start = new Date(l.from_date);
      const end = new Date(l.to_date);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = getDateKey(d.getFullYear(), d.getMonth(), d.getDate());
        map[key] = l.leave_type; // CL / SL / PL
      }
    });

    return map;
  }, [leaves]);

  const todayKey = getDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  /* ================= CALENDAR ================= */

  const calendar = useMemo(() => {

    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const start = firstDay.getDay();
    const total = Math.ceil((start + daysInMonth) / 7) * 7;

    const todayMid = toMidnight(today);

    const cells = [];

    for (let i = 0; i < total; i++) {

      const day = i - start + 1;
      const valid = day > 0 && day <= daysInMonth;

      if (!valid) {
        cells.push({ key: i });
        continue;
      }

      const dateKey = getDateKey(year, month, day);

      const status = getStatus({
        log: logMap[dateKey],
        leaveMap,
        isWeekend: i % 7 === 0 || i % 7 === 6,
        dateKey,
        todayKey,
        today: todayMid,
        joiningDate
      });

      cells.push({
        key: dateKey,
        day,
        status,
        isToday:
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
      });
    }

    return cells;

  }, [currentMonth, logs, leaves, joiningDate]);

  /* ================= STATUS COLORS ================= */

  const getBadgeStyle = (status) => {
    if (status === "P") return "bg-green-500";
    if (status === "A") return "bg-red-500";

    if (status === "CL") return "bg-yellow-500";
    if (status === "SL") return "bg-purple-500";
    if (status === "PL") return "bg-blue-500";
    if (status === "CO") return "bg-indigo-500";
    if (status === "LOP") return "bg-gray-500";

    return "bg-muted";
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-4">

      <Tabs defaultValue="attendance">

        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="my-leaves">My Leaves</TabsTrigger>
          <TabsTrigger value="leave-approvals">Approval</TabsTrigger>
        </TabsList>

        {/* ATTENDANCE */}

        <TabsContent value="attendance">

          <Card>

            <CardHeader className="flex justify-between items-center">
              <CardTitle>Attendance</CardTitle>

              <div className="flex gap-2">
                <Button size="icon" variant="outline"
                  onClick={()=>setCurrentMonth(p=>new Date(p.getFullYear(),p.getMonth()-1,1))}>
                  <ChevronLeft/>
                </Button>

                <div className="font-semibold px-2">
                  {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>

                <Button size="icon" variant="outline"
                  onClick={()=>setCurrentMonth(p=>new Date(p.getFullYear(),p.getMonth()+1,1))}>
                  <ChevronRight/>
                </Button>
              </div>

            </CardHeader>

            <CardContent>

              {loading ? (
                <div className="flex items-center justify-center min-h-[300px] w-full">
                  <Spinner className="w-8 h-8 animate-spin" />
                </div>
              ) : (

                <div className="grid grid-cols-7 border rounded-md">

                  {WEEKDAYS.map(d => (
                    <div key={d} className="text-center p-2 font-semibold bg-muted border-b">
                      {d}
                    </div>
                  ))}

                  {calendar.map(cell => (
                    <div key={cell.key} className="h-[85px] border p-2 relative">

                      {cell.day && (
                        <>
                          <div className={`font-semibold ${
                            cell.isToday ? "bg-primary text-white px-2 rounded-full inline-block" : ""
                          }`}>
                            {cell.day}
                          </div>

                          {cell.status && (
                            <Badge className={`absolute bottom-2 right-2 text-white ${getBadgeStyle(cell.status)}`}>
                              {cell.status}
                            </Badge>
                          )}
                        </>
                      )}

                    </div>
                  ))}

                </div>

              )}

            </CardContent>

          </Card>

        </TabsContent>

        {/* OTHER TABS */}

        <TabsContent value="my-leaves">
          <AttendancceMyleave />
        </TabsContent>

        <TabsContent value="leave-approvals">
          <AttendanceleaveApproval />
        </TabsContent>

      </Tabs>

    </div>
  );
}