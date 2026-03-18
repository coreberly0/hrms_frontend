"use client";

import { useEffect, useState } from "react";
import { getEmployees } from "@/services/employee";

import AddEmployee from "./AddEmployee";
import EmployeeListViewDashboard from "./EmployeeListViewDashboard";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function EmployeeListDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openView, setOpenView] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const paginatedEmployees = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const load = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : data?.employees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><Spinner className="h-10 w-10" /></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-85px)] p-4 sm:p-6 gap-4 max-w-[1400px] mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Employee Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage all company employees</p>
        </div>
        <Button onClick={() => setOpenAdd(true)}><Plus className="mr-2 h-4 w-4" /> Add Employee</Button>
      </div>

      <Separator />

      {/* TABLE HEADER */}
      <div className="hidden sm:grid grid-cols-12 text-sm font-medium text-muted-foreground px-2">
        <div className="col-span-1">#</div>
        <div className="col-span-3">Employee</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-2">Department</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* EMPLOYEE LIST */}
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
          {paginatedEmployees.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No employees found</div>
          ) : (
            paginatedEmployees.map((emp, index) => {
              const statusColor = emp?.status === "Active" ? "bg-green-500" :
                                  emp?.status === "Inactive" ? "bg-gray-500" :
                                  "bg-yellow-400";

              return (
                <div
                  key={emp.id}
                  onClick={() => { setSelectedEmployee(emp); setOpenView(true); }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start sm:items-center border rounded-lg px-4 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                >
                  <div className="hidden sm:block col-span-1 text-sm text-muted-foreground">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </div>

                  <div className="col-span-3 flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback>{emp?.name?.charAt(0) || "?"}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-semibold">{emp?.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {emp?.employee_id || emp?.id}</div>
                    </div>
                  </div>

                  <div className="col-span-2 text-sm">{emp?.position}</div>
                  <div className="col-span-2 text-sm">{emp?.department}</div>

                  <div className="col-span-2">
                    <Badge className={`${statusColor} text-white`}>{emp?.status || "Active"}</Badge>
                  </div>

                  <div className="col-span-2 flex gap-2 sm:justify-end" onClick={(e) => e.stopPropagation()}>
                    <Button size="icon" variant="outline"><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* PAGINATION */}
      {employees.length > itemsPerPage && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} /></PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem><PaginationNext onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ADD EMPLOYEE MODAL */}
      <AddEmployee open={openAdd} onClose={() => setOpenAdd(false)} onSuccess={load} />

      {/* VIEW EMPLOYEE MODAL */}
      {selectedEmployee && (
        <EmployeeListViewDashboard
          open={openView}
          onClose={() => { setOpenView(false); setSelectedEmployee(null); }}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
}