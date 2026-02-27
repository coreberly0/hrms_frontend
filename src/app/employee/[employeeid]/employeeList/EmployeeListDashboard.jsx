"use client";

import { useEffect, useState } from "react";
import { getEmployees } from "@/services/employee";

import AddEmployee from "./AddEmployee";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Plus, Pencil, Trash2 } from "lucide-react";

/* ---------------- DASHBOARD ---------------- */
export default function EmployeeListDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const paginatedEmployees = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [employees, totalPages, currentPage]);

  /* LOAD EMPLOYEES */
  const load = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : (data?.employees || []));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* LOADING */
  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-85px)] p-6 gap-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all company employees
          </p>
        </div>

        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Separator />

      {/* TABLE HEADER */}
      <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground px-4">
        <div className="col-span-1">#</div>
        <div className="col-span-3">Employee</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-2">Department</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* LIST */}
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
          {paginatedEmployees.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No employees found
            </div>
          ) : (
            paginatedEmployees.map((emp, index) => (
              <div
                key={emp.id}
                className="grid grid-cols-12 items-center border rounded-lg px-4 py-4 bg-background hover:bg-muted transition"
              >
                <div className="col-span-1 text-sm text-muted-foreground">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </div>

                {/* EMPLOYEE */}
                <div className="col-span-3 flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {emp.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{emp.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {emp.employeeId || emp.id}
                    </div>
                  </div>
                </div>

                {/* ROLE */}
                <div className="col-span-2">{emp.position}</div>

                {/* DEPARTMENT */}
                <div className="col-span-2">{emp.department}</div>

                {/* STATUS */}
                <div className="col-span-2">
                  <Badge
                    className={
                      emp.status === "Active"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }
                  >
                    {emp.status || "Active"}
                  </Badge>
                </div>

                {/* ACTIONS */}
                <div className="col-span-2 flex justify-end gap-2">
                  <Button size="icon" variant="outline">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* PAGINATION */}
      {employees.length > itemsPerPage && (
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

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
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

      {/* ADD EMPLOYEE DIALOG */}
      {openAdd && (
        <AddEmployee
          onClose={() => setOpenAdd(false)}
          onSuccess={() => {
            setOpenAdd(false);
            load();
          }}
        />
      )}
    </div>
  );
}