"use client";

import { useEffect, useMemo, useState } from "react";
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
  const { employeeid } = useParams();
  const todayKey = toDateInputValue(new Date());
  const initialDate = searchParams.get("date") || todayKey;

  const [taskMap, setTaskMap] = useState({});
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState(initialDate);
  const [taskStart, setTaskStart] = useState("");
  const [taskEnd, setTaskEnd] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimeUpNotice, setShowTimeUpNotice] = useState(true);

  useEffect(() => {
    setTaskDate(initialDate);
  }, [initialDate]);

  // Update current time every minute to check for expired tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute to check task expiration
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!employeeid || typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(`employeeTasks:${employeeid}`);
      const parsed = raw ? JSON.parse(raw) : {};
      setTaskMap(parsed && typeof parsed === "object" ? parsed : {});
    } catch (storageError) {
      setTaskMap({});
    }
  }, [employeeid]);

  useEffect(() => {
    if (!employeeid || typeof window === "undefined") return;
    window.localStorage.setItem(
      `employeeTasks:${employeeid}`,
      JSON.stringify(taskMap)
    );
  }, [employeeid, taskMap]);

  // Check if a task is expired based on its end time
  const isTaskExpired = (task, date) => {
    if (!task.time || !date) return false;
    
    const now = new Date();
    const taskDateObj = new Date(date);
    
    // Only check expiration for tasks on or before today
    if (taskDateObj > now) return false;
    
    // Extract end time from task.time (format: "HH:MM - HH:MM" or "HH:MM")
    let endTime = "";
    if (task.time.includes(" - ")) {
      endTime = task.time.split(" - ")[1];
    } else {
      endTime = task.time;
    }
    
    if (!endTime) return false;
    
    const [hours, minutes] = endTime.split(":").map(Number);
    const taskEndDateTime = new Date(taskDateObj);
    taskEndDateTime.setHours(hours, minutes, 0, 0);
    
    return now > taskEndDateTime;
  };

  const handleRemoveTask = (date, index) => {
    setTaskMap((prev) => {
      const existing = prev[date] || [];
      const updated = existing.filter((_, i) => i !== index);
      if (updated.length === 0) {
        const { [date]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: updated };
    });
  };

  const tasksForDate = useMemo(() => taskMap[taskDate] || [], [taskMap, taskDate]);

  // Find expired tasks for the selected date
  const expiredTasks = useMemo(() => {
    return tasksForDate.filter((task, index) => isTaskExpired(task, taskDate));
  }, [tasksForDate, taskDate, currentTime]);

  const handleAddTask = (event) => {
    event.preventDefault();
    if (!taskTitle.trim() || !taskDate) return;

    const timeLabel = taskStart && taskEnd
      ? `${taskStart} - ${taskEnd}`
      : taskStart || taskEnd || "";

    setTaskMap((prev) => {
      const existing = prev[taskDate] || [];
      return {
        ...prev,
        [taskDate]: [...existing, { title: taskTitle.trim(), time: timeLabel }],
      };
    });

    setTaskTitle("");
    setTaskStart("");
    setTaskEnd("");
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
            value={taskStart}
            onChange={(event) => setTaskStart(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="time"
              value={taskEnd}
              onChange={(event) => setTaskEnd(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add
            </button>
          </div>
        </form>

        <div className="divide-y">
          {tasksForDate.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">
              No tasks scheduled for this date.
            </div>
          ) : (
            tasksForDate.map((task, index) => {
              const expired = isTaskExpired(task, taskDate);
              return (
                <div key={`${taskDate}-${index}`} className="grid grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 px-4 py-4">
                  <div className="text-center text-sm text-slate-500">
                    <div className="font-semibold text-slate-700">
                      {taskDate ? new Date(taskDate).toLocaleDateString("en-US", { weekday: "short" }) : ""}
                    </div>
                    <div className="text-lg font-semibold text-slate-900">
                      {taskDate ? new Date(taskDate).getDate() : ""}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <p className={`font-medium text-slate-900 ${expired ? "line-through text-slate-500" : ""}`}>
                      {task.title}
                    </p>
                    {task.time ? (
                      <p className={`text-sm ${expired ? "text-slate-400" : "text-slate-500"}`}>
                        {task.time}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-slate-700">No check-in - No check-out</p>
                    <p className="text-xs text-red-500">Absent</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(taskDate, index)}
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
