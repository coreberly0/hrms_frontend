"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Plus, Calendar, Clock } from "lucide-react";

export default function MyLeavesPage() {
  const router = useRouter();
  const { employeeid } = useParams();

  const [leaves, setLeaves] = useState([]);

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
      <div className="flex items-center justify-between">
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
            <h1 className="text-2xl font-semibold text-slate-900">My Leaves</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push(`/employee/${employeeid}/apply-leave`)}
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
                onClick={() => router.push(`/employee/${employeeid}/apply-leave`)}
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
    </div>
  );
}
