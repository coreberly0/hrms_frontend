"use client";

import { useEffect, useState } from "react";
import {
  getAllLeaves,
  approveLeave,
  rejectLeave,
} from "@/services/leaveService";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import { CalendarDays } from "lucide-react";

export default function AttendanceleaveApproval() {

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  /* PAGINATION */

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.max(1, Math.ceil(leaves.length / itemsPerPage));

  const paginatedLeaves = leaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pagesToShow = 5;

  const startPage =
    Math.floor((currentPage - 1) / pagesToShow) * pagesToShow + 1;

  const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

  const visiblePages = [];

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  /* DATE FORMAT */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      timeZone: "UTC",
    });
  };

  /* STATUS COLOR */

  const statusColor = {
    Approved: "bg-green-500 text-white",
    Rejected: "bg-red-500 text-white",
    Pending: "bg-yellow-400 text-black",
  };

  /* FETCH LEAVES */

  const fetchLeaves = async () => {
    try {

      setLoading(true);

      const data = await getAllLeaves();

      const pendingLeaves = Array.isArray(data)
        ? data.filter((leave) => leave.status === "Pending")
        : [];

      setLeaves(pendingLeaves);

    } catch (error) {

      console.error("Leave fetch error:", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* APPROVE */

  const handleApprove = async (id) => {

    try {

      setActionLoading(id);

      await approveLeave(id);

      // remove from list instantly
      setLeaves((prev) => prev.filter((leave) => leave.id !== id));

    } catch (error) {

      console.error("Approve error:", error);

    } finally {

      setActionLoading(null);

    }

  };

  /* REJECT */

  const handleReject = async (id) => {

    try {

      setActionLoading(id);

      await rejectLeave(id);

      // remove from list instantly
      setLeaves((prev) => prev.filter((leave) => leave.id !== id));

    } catch (error) {

      console.error("Reject error:", error);

    } finally {

      setActionLoading(null);

    }

  };

  /* LOADING SCREEN */

  if (loading) {

    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );

  }

  return (

    <div className="flex flex-col h-[calc(100vh-90px)] p-6 gap-4">

      {/* HEADER */}

      <div>

        <h1 className="text-2xl font-bold">
          Leave Approval
        </h1>

        <p className="text-sm text-muted-foreground">
          Approve or reject employee leave requests
        </p>

      </div>

      <Separator />

      {/* TABLE HEADER */}

      <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground px-4">

        <div className="col-span-1">#</div>
        <div className="col-span-2">Employee</div>
        <div className="col-span-2">From</div>
        <div className="col-span-2">To</div>
        <div className="col-span-3">Reason</div>
        <div className="col-span-2">Status</div>

      </div>

      {/* LIST */}

      <ScrollArea className="flex-1 pr-2">

        <div className="space-y-2">

          {leaves.length === 0 ? (

            <div className="text-center text-muted-foreground py-10">
              No pending leave requests
            </div>

          ) : (

            paginatedLeaves.map((leave, index) => (

              <div
                key={leave.id}
                className="grid grid-cols-12 items-center border rounded-lg px-4 py-4 hover:bg-gray-50 transition"
              >

                {/* NUMBER */}

                <div className="col-span-1 text-muted-foreground">

                  {(currentPage - 1) * itemsPerPage + index + 1}

                </div>

                {/* EMPLOYEE */}

                <div className="col-span-2 font-medium">

                  {leave.employee_name || `EMP-${leave.employee_id}`}

                </div>

                {/* FROM DATE */}

                <div className="col-span-2 flex items-center gap-2">

                  <CalendarDays className="h-4 w-4 text-muted-foreground" />

                  {formatDate(leave.from_date)}

                </div>

                {/* TO DATE */}

                <div className="col-span-2">

                  {formatDate(leave.to_date)}

                </div>

                {/* REASON */}

                <div className="col-span-3 text-muted-foreground">

                  {leave.reason || "-"}

                </div>

                {/* STATUS + ACTION */}

                <div className="col-span-2 flex items-center justify-between gap-2">

                  <Badge className={statusColor[leave.status]}>
                    {leave.status}
                  </Badge>

                  {leave.status === "Pending" && (

                    <div className="flex gap-2">

                      <Button
                        size="sm"
                        disabled={actionLoading === leave.id}
                        onClick={() => handleApprove(leave.id)}
                      >
                        {actionLoading === leave.id ? "..." : "Accept"}
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actionLoading === leave.id}
                        onClick={() => handleReject(leave.id)}
                      >
                        Reject
                      </Button>

                    </div>

                  )}

                </div>

              </div>

            ))

          )}

        </div>

      </ScrollArea>

      {/* PAGINATION */}

      {leaves.length > itemsPerPage && (

        <div className="mt-auto flex justify-center">

          <Pagination>

            <PaginationContent>

              <PaginationItem>

                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((p) => Math.max(p - 1, 1))
                  }
                />

              </PaginationItem>

              {visiblePages.map((page) => (

                <PaginationItem key={page}>

                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>

                </PaginationItem>

              ))}

              <PaginationItem>

                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(p + 1, totalPages)
                    )
                  }
                />

              </PaginationItem>

            </PaginationContent>

          </Pagination>

        </div>

      )}

    </div>

  );

}