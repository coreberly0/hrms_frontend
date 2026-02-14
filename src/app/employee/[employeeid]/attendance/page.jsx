"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDateKey(year, monthIndex, day) {
  const month = String(monthIndex + 1).padStart(2, "0");
  const date = String(day).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function toMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getAttendanceStatus({ log, isWeekend, dateKey, todayKey, today }) {
  if (isWeekend) return null;
  if (log?.status === "Present" || log?.loginTime) return "Present";
  if (log?.status === "Absent") return "Absent";

  const cellDate = new Date(dateKey);
  if (cellDate <= today && dateKey !== todayKey) return "Absent";

  return null;
}

function getDailyReminder(dateKey, taskMap) {
  if (!taskMap[dateKey]?.length) return null;
  return "Task reminder";
}

export default function AttendancePage() {
  const today = new Date();
  const { employeeid } = useParams();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [taskMap, setTaskMap] = useState({});
  const [notifiedToday, setNotifiedToday] = useState(false);
  const [showTaskNotice, setShowTaskNotice] = useState(false);

  useEffect(() => {
    if (!employeeid) return;

    let isActive = true;

    async function fetchLogs() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/employees/${employeeid}`);
        if (!response.ok) {
          throw new Error("Unable to fetch attendance logs");
        }
        const data = await response.json();
        if (isActive) {
          setLogs(Array.isArray(data) ? data : []);
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError.message || "Unable to fetch attendance logs");
          setLogs([]);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    fetchLogs();

    return () => {
      isActive = false;
    };
  }, [employeeid]);

  useEffect(() => {
    if (!employeeid || typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(`employeeTasks:${employeeid}`);
      const parsed = raw ? JSON.parse(raw) : {};
      setTaskMap(parsed && typeof parsed === "object" ? parsed : {});
    } catch (storageError) {
      setTaskMap({});
    }

    setNotifiedToday(false);
  }, [employeeid]);

  const logMap = useMemo(() => {
    const map = {};
    logs.forEach((log) => {
      if (!log?.date) return;
      map[log.date] = log;
    });
    return map;
  }, [logs]);

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
    for (let i = 0; i < totalCells; i += 1) {
      const dayNumber = i - startWeekDay + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const weekDayIndex = i % 7;

      if (!isCurrentMonth) {
        cells.push({
          key: `empty-${i}`,
          isCurrentMonth: false,
        });
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
      });
      const reminder = getDailyReminder(dateKey, taskMap);
      const isToday =
        dayNumber === today.getDate() &&
        monthIndex === today.getMonth() &&
        year === today.getFullYear();

      cells.push({
        key: dateKey,
        isCurrentMonth: true,
        dayNumber,
        weekDayIndex,
        status,
        reminder,
        isToday,
      });
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }

    return rows;
  }, [currentMonth, today, logMap, taskMap]);

  const todayKey = useMemo(
    () =>
      getDateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ),
    [today]
  );

  const todayTasks = useMemo(
    () => taskMap[todayKey] || [],
    [taskMap, todayKey]
  );

  useEffect(() => {
    if (notifiedToday) return;

    if (todayTasks.length) {
      setNotifiedToday(true);
      setShowTaskNotice(true);
    }
  }, [todayTasks, notifiedToday]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-6">
      {showTaskNotice && todayTasks.length > 0 ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">Task notification for today</p>
              <div className="mt-2 space-y-1">
                {todayTasks.map((task, index) => (
                  <p key={`today-task-${index}`}>
                    <span className="font-medium">{task.title}</span>
                    {task.time ? <span className="text-blue-700"> · {task.time}</span> : null}
                  </p>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTaskNotice(false)}
              className="text-xs font-medium text-blue-700 hover:text-blue-900"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500">
            Track daily attendance with reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!employeeid) return;
              const todayKey = getDateKey(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              router.push(`/employee/${employeeid}/attendance/tasks?date=${todayKey}`);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Task Reminder
          </button>
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="px-4 py-3 text-sm text-slate-500">
            Loading attendance logs...
          </div>
        ) : null}
        {error ? (
          <div className="px-4 py-3 text-sm text-red-600">{error}</div>
        ) : null}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-600">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`px-4 py-3 ${
                index === 0
                  ? "bg-amber-50 text-amber-700"
                  : index === 6
                  ? "bg-amber-50 text-amber-700"
                  : ""
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-rows-6">
          {calendarRows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-7">
              {row.map((cell) => {
                if (!cell.isCurrentMonth) {
                  return (
                    <div
                      key={cell.key}
                      className="min-h-[110px] border-b border-r border-slate-200 bg-slate-50"
                    />
                  );
                }

                const statusStyles =
                  cell.status === "Absent"
                    ? "border-red-300 bg-red-50 text-red-600"
                    : cell.status === "Present"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-transparent";

                const weekendStyles =
                  cell.weekDayIndex === 0 || cell.weekDayIndex === 6
                    ? "bg-amber-50"
                    : "";

                return (
                  <div
                    key={cell.key}
                    className={`min-h-[110px] border-b border-r border-slate-200 px-3 py-3 ${weekendStyles}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium text-slate-700 ${
                          cell.isToday
                            ? "rounded-full bg-blue-600 px-2 py-1 text-white"
                            : ""
                        }`}
                      >
                        {cell.dayNumber}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {cell.status && (
                        <span
                          className={`inline-flex w-full items-center justify-center rounded-md border px-2 py-1 text-xs font-medium ${statusStyles}`}
                        >
                          {cell.status}
                        </span>
                      )}
                      {cell.reminder && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!employeeid) return;
                            router.push(`/employee/${employeeid}/attendance/tasks?date=${cell.key}`);
                          }}
                          className="inline-flex w-full items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700 hover:bg-blue-100"
                        >
                          {cell.reminder}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}