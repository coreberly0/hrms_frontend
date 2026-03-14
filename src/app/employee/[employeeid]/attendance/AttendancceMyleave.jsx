"use client";

import { useEffect, useState } from "react";
import { getMyLeaves } from "@/services/leaveService";

import ApplyLeave from "./ApplyLeave";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { CalendarDays } from "lucide-react";

export default function AttendancceMyleave() {

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  /* PAGINATION */

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(leaves.length / itemsPerPage);

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

  const fetchLeaves = async () => {

    try {

      const data = await getMyLeaves();

      setLeaves(data || []);

    } catch (error) {

      console.error("Leave fetch error:", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchLeaves();

  }, []);

  /* LOADING */

  if (loading) {

    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );

  }

  return (

    <div className="flex flex-col h-[calc(100vh-140px)] p-6 gap-4">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            My Leave Requests
          </h1>

          <p className="text-sm text-muted-foreground">
            View and manage your leave applications
          </p>

        </div>

        {/* APPLY LEAVE DIALOG */}

        <Dialog open={open} onOpenChange={setOpen}>

          <DialogTrigger asChild>
            <Button>Apply Leave</Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">

            <DialogHeader>
              <DialogTitle>Apply Leave</DialogTitle>
            </DialogHeader>

            <ApplyLeave />

          </DialogContent>

        </Dialog>

      </div>

      <Separator />

      {/* GRID HEADER */}

      <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground px-4">

        <div className="col-span-1">#</div>
        <div className="col-span-3">From Date</div>
        <div className="col-span-3">To Date</div>
        <div className="col-span-3">Reason</div>
        <div className="col-span-2">Status</div>

      </div>

      {/* LIST */}

      <ScrollArea className="flex-1 pr-2">

        <div className="space-y-2">

          {leaves.length === 0 ? (

            <div className="text-center text-muted-foreground py-10">
              No leave records found
            </div>

          ) : (

            paginatedLeaves.map((leave, index) => (

              <div
                key={leave.id}
                className="grid grid-cols-12 items-center border rounded-lg px-4 py-4 hover:bg-gray-50 transition"
              >

                <div className="col-span-1 text-muted-foreground">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </div>

                <div className="col-span-3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  {new Date(leave.from_date).toLocaleDateString("en-IN")}
                </div>

                <div className="col-span-3">
                  {new Date(leave.to_date).toLocaleDateString("en-IN")}
                </div>

                <div className="col-span-3 text-muted-foreground">
                  {leave.reason}
                </div>

                <div className="col-span-2">

                  <Badge
                    className={
                      leave.status === "Approved"
                        ? "bg-green-500"
                        : leave.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-400 text-black"
                    }
                  >
                    {leave.status}
                  </Badge>

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
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
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