"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function GrievancesPage() {
  const params = useParams();
  const employeeid = params?.employeeid;

  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(`grievances_${employeeid}`);
    if (saved) setGrievances(JSON.parse(saved));
  }, [employeeid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    const newGrievance = {
      id: Date.now(),
      subject,
      description,
      anonymous,
      status: "Pending",
      createdAt: new Date().toLocaleDateString(),
    };

    const updated = [...grievances, newGrievance];
    setGrievances(updated);
    localStorage.setItem(`grievances_${employeeid}`, JSON.stringify(updated));

    // Reset form
    setSubject("");
    setDescription("");
    setAnonymous(false);
    setSubmitting(false);
  };

  if (!mounted) return null;

  return (
    <div className="w-full bg-background">
      <div className="space-y-4 md:space-y-5 pb-8 md:pb-16">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Grievance & Complaints
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Report workplace issues safely and securely
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Submit Complaint Card */}
          <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
            <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-6">
              <span className="text-xl md:text-2xl">⚠️</span>
              <h2 className="text-base md:text-lg font-extrabold text-foreground">
                Submit a Complaint
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Subject */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Workplace Harassment"
                  className="w-full h-10 px-3 rounded-lg border border-border text-sm text-foreground bg-card
                    outline-none transition-all
                    focus:ring-2 focus:ring-[#1C225B]/30 focus:border-[#1C225B]
                    hover:border-border/80"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm text-foreground bg-card
                    outline-none transition-all resize-none
                    focus:ring-2 focus:ring-[#1C225B]/30 focus:border-[#1C225B]
                    hover:border-border/80"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-[#1C225B]"
                />
                <label
                  htmlFor="anonymous"
                  className="text-sm text-muted-foreground cursor-pointer flex items-center gap-2"
                >
                  <span>🔒</span> Submit Anonymously
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>

          {/* History Card */}
          <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm p-4 md:p-6">
            <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-6">
              <span className="text-xl md:text-2xl">📋</span>
              <h2 className="text-base md:text-lg font-extrabold text-foreground">
                My History
              </h2>
            </div>

            {grievances.length === 0 ? (
              <div className="h-56 md:h-96 flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  No complaints found.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-88 md:max-h-96 overflow-y-auto pr-1">
                {grievances.map((grievance) => (
                  <div
                    key={grievance.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground text-sm flex-1">
                        {grievance.subject}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          grievance.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                            : grievance.status === "Resolved"
                            ? "bg-green-500/20 text-green-600 dark:text-green-400"
                            : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {grievance.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {grievance.description.substring(0, 100)}
                      {grievance.description.length > 100 ? "..." : ""}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>{grievance.createdAt}</span>
                      {grievance.anonymous && (
                        <span className="text-xs text-muted-foreground">
                          🔒 Anonymous
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
