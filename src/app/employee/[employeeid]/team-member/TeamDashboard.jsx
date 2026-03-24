"use client";

import { useEffect, useState } from "react";
import {
  getTeams,
  getTeamMembers,
  removeTeamMember,
} from "@/services/teamService";

import { getEmployeeById } from "@/services/employee";

import TeamMemberView from "./TeamMemberView";
import AddTeamMember from "./AddTeamMember";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Users, Trash2, Plus } from "lucide-react";

export default function TeamDashboard() {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(false); // ✅ NEW

  const [selectedMember, setSelectedMember] = useState(null);
  const [openView, setOpenView] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);

  const loadTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data || []);
      if (data?.length > 0) setSelectedTeam(data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMembers = async (teamId) => {
    try {
      setLoading(true);
      const data = await getTeamMembers(teamId);
      setMembers(Array.isArray(data) ? data : data?.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTeams(); }, []);
  useEffect(() => { if (selectedTeam) loadMembers(selectedTeam); }, [selectedTeam]);

  const handleRemove = async (id) => {
    await removeTeamMember(id);
    loadMembers(selectedTeam);
  };

  /* ✅ FIXED */
  const handleView = async (member) => {
    setSelectedMember(member);
    setOpenView(true);

    try {
      if (!member?.employee_id) return;

      setViewLoading(true); // ✅ start spinner

      const res = await getEmployeeById(member.employee_id);

      const fullData =
        res?.employee ||
        res?.data ||
        res ||
        member;

      setSelectedMember(fullData);
    } catch (err) {
      console.error(err);
    } finally {
      setViewLoading(false); // ✅ stop spinner
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-85px)] p-6 gap-4">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users /> Team Members
        </h1>

        <div className="flex gap-2">
          <Button onClick={() => setOpenAdd(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>

          <select
            value={selectedTeam || ""}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.team_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {members.map((m, i) => (
            <div
              key={m.id}
              onClick={() => handleView(m)}
              className="grid grid-cols-12 p-4 border rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="col-span-1">{i + 1}</div>

              <div className="col-span-5 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {m?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.employee_id}
                  </p>
                </div>
              </div>

              <div className="col-span-4">{m.email}</div>

              <div
                className="col-span-2 flex justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleRemove(m.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* ✅ VIEW */}
      {selectedMember && (
        <TeamMemberView
          open={openView}
          loading={viewLoading} // ✅ FIXED
          onClose={() => {
            setOpenView(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
        />
      )}

      <AddTeamMember
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        teamId={selectedTeam}
        onSuccess={() => loadMembers(selectedTeam)}
      />
    </div>
  );
}