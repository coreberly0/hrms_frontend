"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMyAttendance } from "@/services/attendanceService";
import { getEmployeeById } from "@/services/employee";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getDateKey(year, monthIndex, day) {
  const month = String(monthIndex + 1).padStart(2, "0");
  const date = String(day).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function toMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/* ================= ATTENDANCE LOGIC ================= */
function getAttendanceStatus({
  log,
  isWeekend,
  dateKey,
  todayKey,
  today,
  joiningDate,
}) {
  if (isWeekend) return null;

  const cellDate = new Date(dateKey);

  // ❌ BEFORE JOINING DATE → NOTHING
  if (joiningDate && cellDate < joiningDate) {
    return null;
  }

  // ✅ BACKEND STATUS
  if (log?.status === "P" || log?.status === "Present") return "Present";
  if (log?.status === "A" || log?.status === "Absent") return "Absent";

  // ✅ AFTER JOINING DATE + PAST DAY → ABSENT
  if (
    joiningDate &&
    cellDate >= joiningDate &&
    cellDate < today &&
    dateKey !== todayKey
  ) {
    return "Absent";
  }

  return null;
}

export default function AttendancePage() {
  const today = new Date();
  const { employeeid } = useParams();

  const [logs, setLogs] = useState([]);
  const [joiningDate, setJoiningDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        setLoading(true);

        // 1️⃣ Attendance
        const attendance = await getMyAttendance();
        const normalizedLogs = (Array.isArray(attendance) ? attendance : []).map(
          (row) => ({
            date: row.date?.split("T")[0],
            status: row.status,
          })
        );

        // 2️⃣ Employee Joining Date
        const employee = await getEmployeeById(employeeid);
        const joinDate = employee?.joining_date
          ? toMidnight(new Date(employee.joining_date))
          : null;

        if (active) {
          setLogs(normalizedLogs);
          setJoiningDate(joinDate);
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load attendance");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    return () => (active = false);
  }, [employeeid]);

  /* ================= MAP ================= */
  const logMap = useMemo(() => {
    const map = {};
    logs.forEach((log) => {
      if (log?.date) map[log.date] = log;
    });
    return map;
  }, [logs]);

  /* ================= CALENDAR ================= */
  const calendarRows = useMemo(() => {
    const monthIndex = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const firstDay = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const startWeekDay = firstDay.getDay();
    const totalCells = Math.ceil((startWeekDay + daysInMonth) / 7) * 7;

    const todayMidnight = toMidnight(today);
    const todayKey = getDateKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startWeekDay + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const weekDayIndex = i % 7;

      if (!isCurrentMonth) {
        cells.push({ key: `empty-${i}`, isCurrentMonth: false });
        continue;
      }

      const dateKey = getDateKey(year, monthIndex, dayNumber);
      const isWeekend = weekDayIndex === 0 || weekDayIndex === 6;
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

      cells.push({
        key: dateKey,
        isCurrentMonth: true,
        dayNumber,
        status,
        isToday,
      });
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }

    return rows;
  }, [currentMonth, today, logMap, joiningDate]);

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Attendance</h1>

        <div className="flex items-center gap-3">
          <button onClick={() =>
            setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1))
          }>
            <ChevronLeft />
          </button>

          <div className="font-medium">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>

          <button onClick={() =>
            setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1))
          }>
            <ChevronRight />
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="rounded-2xl border bg-white">
        <div className="grid grid-cols-7 border-b bg-slate-50 text-sm font-medium">
          {WEEKDAYS.map((day) => (
            <div key={day} className="px-4 py-3">{day}</div>
          ))}
        </div>

        {calendarRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7">
            {row.map((cell) => (
              <div
                key={cell.key}
                className="relative min-h-[110px] border-b border-r px-3 py-3"
              >
                {cell.isCurrentMonth && (
                  <>
                    <span className={`text-sm font-medium ${
                      cell.isToday ? "rounded-full bg-blue-600 px-2 py-1 text-white" : ""
                    }`}>
                      {cell.dayNumber}
                    </span>

                    {cell.status && (
                      <span
                        className={`absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                          cell.status === "Absent"
                            ? "bg-red-500 text-white"
                            : "bg-emerald-500 text-white"
                        }`}
                      >
                        {cell.status === "Absent" ? "A" : "P"}
                      </span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}