"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getMyAttendance } from "@/services/attendanceService";
import { getEmployeeById } from "@/services/employee";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getDateKey(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function toMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getAttendanceStatus({ log, isWeekend, dateKey, todayKey, today, joiningDate }) {
  if (isWeekend) return null;

  const cellDate = new Date(dateKey);

  if (joiningDate && cellDate < joiningDate) return null;

  if (log?.status === "P" || log?.status === "Present") return "Present";
  if (log?.status === "A" || log?.status === "Absent") return "Absent";

  if (joiningDate && cellDate >= joiningDate && cellDate < today && dateKey !== todayKey)
    return "Absent";

  return null;
}

export default function AttendancePage() {
  const today = new Date();
  const { employeeid } = useParams();

  const [logs, setLogs] = useState([]);
  const [joiningDate, setJoiningDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  useEffect(() => {
    if (!employeeid) return;
    let active = true;

    async function fetchData() {
      try {
        setLoading(true);

        const attendance = await getMyAttendance();
        const normalized = (attendance || []).map((r) => ({
          date: r.date?.split("T")[0],
          status: r.status,
        }));

        const employee = await getEmployeeById(employeeid);
        const join = employee?.joining_date
          ? toMidnight(new Date(employee.joining_date))
          : null;

        if (active) {
          setLogs(normalized);
          setJoiningDate(join);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    return () => (active = false);
  }, [employeeid]);

  const logMap = useMemo(() => {
    const map = {};
    logs.forEach((l) => (map[l.date] = l));
    return map;
  }, [logs]);

  const todayKey = getDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const calendarRows = useMemo(() => {
    const monthIndex = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const firstDay = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const startWeekDay = firstDay.getDay();
    const totalCells = Math.ceil((startWeekDay + daysInMonth) / 7) * 7;

    const todayMidnight = toMidnight(today);
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startWeekDay + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

      if (!isCurrentMonth) {
        cells.push({ key: `empty-${i}`, isCurrentMonth: false });
        continue;
      }

      const dateKey = getDateKey(year, monthIndex, dayNumber);
      const isWeekend = i % 7 === 0 || i % 7 === 6;
      const log = logMap[dateKey];

      const status = getAttendanceStatus({
        log,
        isWeekend,
        dateKey,
        todayKey,
        today: todayMidnight,
        joiningDate,
      });

      const isToday =
        dayNumber === today.getDate() &&
        monthIndex === today.getMonth() &&
        year === today.getFullYear();

      cells.push({ key: dateKey, isCurrentMonth: true, dayNumber, status, isToday });
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [currentMonth, logs, joiningDate]);

  return (
    <div className="space-y-4">

      <Tabs defaultValue="attendance" className="w-full">

        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="apply-leave">Apply Leave</TabsTrigger>
          <TabsTrigger value="my-leaves">My Leaves</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Attendance</CardTitle>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentMonth((p) =>
                      new Date(p.getFullYear(), p.getMonth() - 1, 1)
                    )
                  }
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="px-3 font-semibold text-base">
                  {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentMonth((p) =>
                      new Date(p.getFullYear(), p.getMonth() + 1, 1)
                    )
                  }
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>

              {loading ? (
                <div className="flex items-center justify-center h-[320px]">
                  <Spinner />
                </div>
              ) : (
                <div className="grid grid-cols-7 border rounded-md text-sm">

                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      className="p-2 border-b text-center font-semibold bg-muted"
                    >
                      {day}
                    </div>
                  ))}

                  {calendarRows.flat().map((cell) => (
                    <div
                      key={cell.key}
                      className="relative h-[85px] border p-2"
                    >
                      {cell.isCurrentMonth && (
                        <>
                          <div
                            className={`text-sm font-semibold ${
                              cell.isToday
                                ? "bg-primary text-white px-2 py-0.5 rounded-full inline-block"
                                : ""
                            }`}
                          >
                            {cell.dayNumber}
                          </div>

                          {cell.status && (
                            <Badge
                              className={`absolute bottom-2 right-2 ${
                                cell.status === "Absent"
                                  ? "bg-red-500 text-white"
                                  : "bg-emerald-500 text-white"
                              }`}
                            >
                              {cell.status === "Absent" ? "A" : "P"}
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
      </Tabs>
    </div>
  );
}