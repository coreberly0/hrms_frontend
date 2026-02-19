"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";

function toDateInputValue(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export default function TaskReminderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    employeeid } = useParams();
  const todayKey = toDateInputValue(new Date());
  const initialDate = searchParams.get("date") || todayKey;

  const [taskMap, setTaskMap] = useState({});
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState(initialDate);
  const [taskTime, setTaskTime] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeUpNotice, setShowTimeUpNotice] = useState(true);
  const hasLoadedRef = useRef(false);

  const readStoredTaskMap = () => {
    if (!employeeid || typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(`employeeTasks:${employeeid}`);
      const parsed = raw ? JSON.parse(raw) : {};
      if (!parsed || typeof parsed !== "object") return {};
      return Object.keys(parsed).reduce((acc, dateKey) => {
        const tasks = Array.isArray(parsed[dateKey]) ? parsed[dateKey] : [];
        acc[dateKey] = tasks.map((task) => ({
          title: task.title || "",
          time: task.time || "",
          completed: Boolean(task.completed),
        }));
        return acc;
      }, {});
    } catch (storageError) {
      return {};
    }
  };

  const writeStoredTaskMap = (nextMap) => {
    if (!employeeid || typeof window === "undefined") return;
    window.localStorage.setItem(
      `employeeTasks:${employeeid}`,
      JSON.stringify(nextMap)
    );
  };

  useEffect(() => {
    if (!employeeid || typeof window === "undefined") {
      setTaskDate(initialDate);
      return;
    }

    const storedDate = window.localStorage.getItem(
      `employeeTasks:lastDate:${employeeid}`
    );
    setTaskDate(storedDate || initialDate);
  }, [employeeid, initialDate]);

  // Update current time every minute to check for expired tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute to check task expiration
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!employeeid || typeof window === "undefined") return;
    const normalized = readStoredTaskMap();
    setTaskMap(normalized);
    hasLoadedRef.current = true;
  }, [employeeid]);

  useEffect(() => {
    if (!employeeid || typeof window === "undefined") return;
    if (!hasLoadedRef.current) return;
    const latest = readStoredTaskMap();
    if (Object.keys(latest).length === 0) return;
    setTaskMap(latest);
  }, [employeeid, taskDate]);

  useEffect(() => {
    if (!employeeid || typeof window === "undefined") return;
    if (!taskDate) return;
    window.localStorage.setItem(`employeeTasks:lastDate:${employeeid}`, taskDate);
  }, [employeeid, taskDate]);

  // Check if a task is expired based on its deadline
  const isTaskExpired = (task, date) => {
    if (!date) return false;

    const now = new Date();
    const taskDateObj = new Date(date);

    // Only check expiration for tasks on or before today
    if (taskDateObj > now) return false;

    const taskEndDateTime = new Date(taskDateObj);
    if (task.time) {
      const [hours, minutes] = task.time.split(":").map(Number);
      taskEndDateTime.setHours(hours, minutes, 0, 0);
    } else {
      taskEndDateTime.setHours(23, 59, 59, 999);
    }

    return now > taskEndDateTime;
  };

  const handleRemoveTask = (date, index) => {
    const stored = readStoredTaskMap();
    const existing = stored[date] || [];
    const updated = existing.filter((_, i) => i !== index);
    let nextMap = {};
    if (updated.length === 0) {
      const { [date]: removed, ...rest } = stored;
      nextMap = rest;
    } else {
      nextMap = { ...stored, [date]: updated };
    }
    writeStoredTaskMap(nextMap);
    setTaskMap(nextMap);
  };

  const tasksForDate = useMemo(() => taskMap[taskDate] || [], [taskMap, taskDate]);

  const queuedTasks = useMemo(() => {
    const items = [];
    Object.keys(taskMap).forEach((dateKey) => {
      const tasks = Array.isArray(taskMap[dateKey]) ? taskMap[dateKey] : [];
      tasks.forEach((task, index) => {
        items.push({
          dateKey,
          index,
          task,
        });
      });
    });

    return items.sort((a, b) => {
      if (a.dateKey !== b.dateKey) return a.dateKey.localeCompare(b.dateKey);
      const timeA = a.task.time || "99:99";
      const timeB = b.task.time || "99:99";
      return timeA.localeCompare(timeB);
    });
  }, [taskMap]);

  // Find expired tasks for the selected date
  const expiredTasks = useMemo(() => {
    return tasksForDate.filter((task) => !task.completed && isTaskExpired(task, taskDate));
  }, [tasksForDate, taskDate, currentTime]);

  const handleAddTask = (event) => {
    event.preventDefault();
    if (!taskTitle.trim() || !taskDate) return;

    const stored = readStoredTaskMap();
    const existing = stored[taskDate] || [];
    const nextMap = {
      ...stored,
      [taskDate]: [
        ...existing,
        { title: taskTitle.trim(), time: taskTime || "", completed: false },
      ],
    };
    writeStoredTaskMap(nextMap);
    setTaskMap(nextMap);

    setTaskTitle("");
    setTaskTime("");
  };

  const handleToggleComplete = (date, index) => {
    const stored = readStoredTaskMap();
    const existing = stored[date] || [];
    const updated = existing.map((task, taskIndex) => {
      if (taskIndex !== index) return task;
      return { ...task, completed: !task.completed };
    });
    const nextMap = { ...stored, [date]: updated };
    writeStoredTaskMap(nextMap);
    setTaskMap(nextMap);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(`/employee/${employeeid}/attendance`)}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
          aria-label="Back to attendance"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm text-slate-500">Task Reminder</p>
          <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
        </div>
      </div>

      {showTimeUpNotice && expiredTasks.length > 0 ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-red-900">Time up!</p>
              {expiredTasks.map((task, index) => (
                <p key={`expired-${index}`} className="text-sm text-red-800">
                  <span className="font-medium">{task.title}</span>
                  {task.time ? <span> · {task.time}</span> : null}
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowTimeUpNotice(false)}
              className="rounded px-3 py-1 text-sm text-red-700 hover:bg-red-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Tasks for {taskDate || "-"}
          </h2>
        </div>

        <form onSubmit={handleAddTask} className="grid gap-3 border-b border-slate-200 px-4 py-4 md:grid-cols-4">
          <input
            type="text"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="Task title"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            required
          />
          <input
            type="date"
            value={taskDate}
            onChange={(event) => setTaskDate(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            required
          />
          <input
            type="time"
            value={taskTime}
            onChange={(event) => setTaskTime(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add
          </button>
        </form>

      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-slate-900">Task Queue</h2>
          <p className="text-sm text-slate-500">All scheduled tasks in order</p>
        </div>

        <div className="divide-y">
          {queuedTasks.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">
              No tasks scheduled yet.
            </div>
          ) : (
            queuedTasks.map((entry) => {
              const expired = !entry.task.completed && isTaskExpired(entry.task, entry.dateKey);
              const statusLabel = entry.task.completed ? "Completed" : expired ? "Pending" : "Upcoming";
              const statusClass = entry.task.completed
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : expired
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-slate-50 text-slate-700 border-slate-200";

              return (
                <div key={`${entry.dateKey}-${entry.index}`} className="grid grid-cols-[120px_minmax(0,1fr)_auto_auto] gap-4 px-4 py-4">
                  <div className="text-sm text-slate-600">
                    <div className="font-semibold text-slate-900">
                      {new Date(entry.dateKey).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                      })}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(entry.dateKey).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                  </div>
                  <div>
                    <p className={`font-medium text-slate-900 ${expired ? "line-through text-slate-500" : ""}`}>
                      {entry.task.title}
                    </p>
                    {entry.task.time ? (
                      <p className={`text-sm ${expired ? "text-slate-400" : "text-slate-500"}`}>
                        {entry.task.time}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right text-sm">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <label className="mr-2 flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={!!entry.task.completed}
                        onChange={() => handleToggleComplete(entry.dateKey, entry.index)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900"
                      />
                      Completed
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(entry.dateKey, entry.index)}
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                      aria-label="Remove task"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}