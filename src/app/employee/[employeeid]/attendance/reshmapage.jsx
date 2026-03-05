"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus } from "lucide-react";

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
  
  // Tab state
  const [activeTab, setActiveTab] = useState("attendance");
  
  // Leave application state
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState([]);

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
        
        // Merge with localStorage attendance data
        const mergedLogs = mergeWithLocalStorageAttendance(
          Array.isArray(data) ? data : []
        );
        
        if (isActive) {
          setLogs(mergedLogs);
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError.message || "Unable to fetch attendance logs");
          // Still load from localStorage even if API fails
          const localLogs = loadLocalStorageAttendance();
          setLogs(localLogs);
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
  
  const loadLocalStorageAttendance = () => {
    if (!employeeid || typeof window === "undefined") return [];
    
    const logsKey = `employeeAttendanceLogs:${employeeid}`;
    const stored = window.localStorage.getItem(logsKey);
    return stored ? JSON.parse(stored) : [];
  };
  
  const mergeWithLocalStorageAttendance = (apiLogs) => {
    if (!employeeid || typeof window === "undefined") return apiLogs;
    
    const localLogs = loadLocalStorageAttendance();
    
    // Create a map of API logs by date
    const apiLogMap = {};
    apiLogs.forEach((log) => {
      if (log.date) {
        apiLogMap[log.date] = log;
      }
    });
    
    // Merge local logs (they take precedence)
    localLogs.forEach((localLog) => {
      apiLogMap[localLog.date] = localLog;
    });
    
    // Convert back to array
    return Object.values(apiLogMap);
  };

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
  
  // Load leaves from localStorage
  useEffect(() => {
    if (!employeeid || typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(`employeeLeaves:${employeeid}`);
      const parsed = raw ? JSON.parse(raw) : [];
      setLeaves(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      setLeaves([]);
    }
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
  
  // Leave form submission handler
  const handleLeaveSubmit = (event) => {
    event.preventDefault();
    
    if (!employeeid || typeof window === "undefined") return;
    
    // Get existing leaves from localStorage
    const existingLeaves = JSON.parse(
      window.localStorage.getItem(`employeeLeaves:${employeeid}`) || "[]"
    );

    // Add new leave
    const newLeave = {
      id: Date.now(),
      leaveType,
      startDate,
      endDate,
      reason,
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };

    existingLeaves.push(newLeave);

    // Save to localStorage
    window.localStorage.setItem(
      `employeeLeaves:${employeeid}`,
      JSON.stringify(existingLeaves)
    );
    
    // Update state
    setLeaves(existingLeaves);

    // Clear form
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");

    // Show success message and switch to My Leaves tab
    alert("Leave application submitted successfully!");
    setActiveTab("my-leaves");
  };
  
  // Helper functions for leaves
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("attendance")}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "attendance"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Attendance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("apply-leave")}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "apply-leave"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Apply Leave
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("my-leaves")}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "my-leaves"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            My Leaves
          </button>
        </div>
      </div>

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <>
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

                    const weekendStyles =
                      cell.weekDayIndex === 0 || cell.weekDayIndex === 6
                        ? "bg-amber-50"
                        : "";

                    return (
                      <div
                        key={cell.key}
                        className={`relative min-h-[110px] border-b border-r border-slate-200 px-3 py-3 ${weekendStyles}`}
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

                        {/* Status indicator in bottom right corner */}
                        {cell.status && (
                          <div className="absolute bottom-2 right-2">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                                cell.status === "Absent"
                                  ? "bg-red-500 text-white"
                                  : "bg-emerald-500 text-white"
                              }`}
                              title={cell.status}
                            >
                              {cell.status === "Absent" ? "A" : "P"}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                P
              </span>
              <span className="text-sm text-slate-700">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                A
              </span>
              <span className="text-sm text-slate-700">Absent</span>
            </div>
          </div>
        </>
      )}

      {/* Apply Leave Tab */}
      {activeTab === "apply-leave" && (
        <>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Apply Leave</h1>
            <p className="text-sm text-slate-500">Submit your leave request</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Leave Application Form
              </h2>
              <p className="text-sm text-slate-500">Fill in the details below</p>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-6 px-6 py-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Leave Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                    required
                  >
                    <option value="">Select leave type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Leave Balance Info */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-900">Available Leave Balance</p>
                  <p className="mt-1 text-2xl font-bold text-blue-700">12 Days</p>
                  <p className="text-xs text-blue-600">Casual Leave: 6 | Sick Leave: 6</p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Enter the reason for your leave..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("my-leaves")}
                  className="rounded-lg border border-slate-200 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  View My Leaves
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* My Leaves Tab */}
      {activeTab === "my-leaves" && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">My Leaves</h1>
              <p className="text-sm text-slate-500">View all your leave requests</p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("apply-leave")}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Apply Leave
            </button>
          </div>

          {/* Leave Balance Summary */}
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Leave Balance</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">12 Days</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <p className="text-sm text-green-700">Approved Leaves</p>
              <p className="mt-1 text-3xl font-bold text-green-800">
                {leaves.filter((l) => l.status === "Approved").length}
              </p>
            </div>
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
              <p className="text-sm text-yellow-700">Pending Approvals</p>
              <p className="mt-1 text-3xl font-bold text-yellow-800">
                {leaves.filter((l) => l.status === "Pending").length}
              </p>
            </div>
          </div>

          {/* Leave Applications List */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Leave Applications
              </h2>
              <p className="text-sm text-slate-500">
                View all your leave requests and their status
              </p>
            </div>

            <div className="divide-y">
              {leaves.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="mt-4 text-sm text-slate-500">
                    No leave applications found
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("apply-leave")}
                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Apply for Leave
                  </button>
                </div>
              ) : (
                leaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="px-6 py-5 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {leave.leaveType}
                          </h3>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                              leave.status
                            )}`}
                          >
                            {leave.status}
                          </span>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {leave.startDate} to {leave.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4" />
                            <span>
                              {calculateDays(leave.startDate, leave.endDate)} day(s)
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm font-medium text-slate-700">Reason:</p>
                          <p className="mt-1 text-sm text-slate-600">{leave.reason}</p>
                        </div>

                        <div className="mt-2 text-xs text-slate-400">
                          Applied on: {leave.appliedOn}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}