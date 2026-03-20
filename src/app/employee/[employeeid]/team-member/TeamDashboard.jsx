"use client";

import { useEffect, useState } from "react";
import {
  getTeams,
  getTeamMembers,
  removeTeamMember,
} from "@/services/teamService";

import TeamMemberView from "./TeamMemberView";
import AddTeamMember from "./AddTeamMember";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Users, Trash2, Plus } from "lucide-react";

export default function TeamDashboard() {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [loading, setLoading] = useState(true);

  /* VIEW MODAL */
  const [selectedMember, setSelectedMember] = useState(null);
  const [openView, setOpenView] = useState(false);

  /* ADD MODAL */
  const [openAdd, setOpenAdd] = useState(false);

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(members.length / itemsPerPage);
  const paginatedMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* LOAD TEAMS */
  const loadTeams = async () => {
    const data = await getTeams();
    setTeams(data || []);

    if (data?.length > 0) {
      setSelectedTeam(data[0].id);
    }
  };

  /* LOAD MEMBERS */
  const loadMembers = async (teamId) => {
    setLoading(true);
    const data = await getTeamMembers(teamId);
    setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) loadMembers(selectedTeam);
  }, [selectedTeam]);

  /* REMOVE */
  const handleRemove = async (id) => {
    await removeTeamMember(id);
    loadMembers(selectedTeam);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-85px)] p-4 sm:p-6 gap-4 max-w-[1400px] mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-blue-500" />
          <h1 className="text-2xl font-bold">Team Members</h1>
        </div>

        <div className="flex gap-2">
          {/* ADD BUTTON */}
          <Button onClick={() => setOpenAdd(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>

          {/* TEAM SELECT */}
          {teams.length > 1 && (
            <select
              value={selectedTeam || ""}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.team_name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <Separator />

      {/* LIST */}
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
          {paginatedMembers.map((m, index) => (
            <div
              key={m.id}
              onClick={() => {
                setSelectedMember(m);
                setOpenView(true);
              }}
              className="grid grid-cols-12 border rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              <div className="col-span-1">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </div>

              <div className="col-span-5 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{m.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ID: {m.employee_id}
                  </div>
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

      {/* VIEW DIALOG */}
      {selectedMember && (
        <TeamMemberView
          open={openView}
          onClose={() => {
            setOpenView(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
        />
      )}

      {/* ADD DIALOG */}
      <AddTeamMember
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        teamId={selectedTeam}
        onSuccess={() => loadMembers(selectedTeam)}
      />
    </div>
  );
}