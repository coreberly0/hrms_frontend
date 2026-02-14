"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function ApplyLeavePage() {
  const router = useRouter();
  const { employeeid } = useParams();

  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
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

    // Clear form
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");

    // Show success message
    alert("Leave application submitted successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(`/employee/${employeeid}`)}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
          aria-label="Back to dashboard"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm text-slate-500">Leave Management</p>
          <h1 className="text-2xl font-semibold text-slate-900">Apply Leave</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Leave Application Form
          </h2>
          <p className="text-sm text-slate-500">Submit your leave request</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
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
              onClick={() => router.push(`/employee/${employeeid}/my-leaves`)}
              className="rounded-lg border border-slate-200 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View My Leaves
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
