"use client";

import { useEffect, useState } from "react";
import { getEmployees } from "@/services/employee";
import { getTeamMembers, addTeamMember } from "@/services/teamService";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { User, Mail, CheckCircle2, UserPlus } from "lucide-react";

export default function AddTeamMember({
  open,
  onClose,
  teamId,
  onSuccess,
}) {
  const [employees, setEmployees] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* LOAD DATA */
  useEffect(() => {
    const loadData = async () => {
      try {
        setFetching(true);

        const [empRes, teamRes] = await Promise.all([
          getEmployees(),
          getTeamMembers(teamId),
        ]);

        setEmployees(
          Array.isArray(empRes) ? empRes : empRes?.employees || []
        );

        setTeamMembers(teamRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    if (open && teamId) loadData();
  }, [open, teamId]);

  /* CHECK DUPLICATE */
  const isAlreadyAdded = (empId) =>
    teamMembers.some((m) => m.employee_id === empId);

  /* ADD MEMBER */
  const handleAdd = async () => {
    if (!selected) return;

    if (isAlreadyAdded(selected)) {
      alert("❌ Already in team");
      return;
    }

    try {
      setLoading(true);

      await addTeamMember({
        team_id: teamId,
        employee_id: selected,
      });

      onSuccess?.();
      onClose();
      setSelected(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl">

        {/* HEADER */}
        <DialogHeader className="px-5 py-4 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Team Member
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="p-4">

          {/* LOADING */}
          {fetching ? (
            <div className="flex justify-center py-10">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto custom-scroll space-y-2 pr-1">

              {employees.map((emp) => {
                const alreadyAdded = isAlreadyAdded(emp.id);

                return (
                  <div
                    key={emp.id}
                    onClick={() => {
                      if (!alreadyAdded) setSelected(emp.id);
                    }}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border transition-all duration-200
                    
                      ${
                        alreadyAdded
                          ? "bg-gray-100 dark:bg-gray-800 opacity-60 cursor-not-allowed"
                          : selected === emp.id
                          ? "bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/40 border-blue-400 shadow-md cursor-pointer"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer hover:shadow-sm"
                      }
                    `}
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3">

                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="font-semibold">
                          {emp.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-1 font-medium text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          {emp.name}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {emp.email}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex justify-end sm:justify-normal">
                      {alreadyAdded ? (
                        <Badge variant="secondary" className="text-xs">
                          Already Added
                        </Badge>
                      ) : selected === emp.id ? (
                        <div className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          Selected
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* FOOTER */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 border-t pt-4">

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              onClick={handleAdd}
              disabled={!selected || loading}
              className="w-full sm:w-auto min-w-[120px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"
            >
              {loading ? <Spinner className="h-4 w-4" /> : "Add Member"}
            </Button>
          </div>
        </div>

        {/* SCROLLBAR */}
        <style jsx>{`
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #6366f1, #3b82f6);
            border-radius: 10px;
          }

          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: #4f46e5;
          }
        `}</style>

      </DialogContent>
    </Dialog>
  );
}