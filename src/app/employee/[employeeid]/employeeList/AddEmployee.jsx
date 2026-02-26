"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { addEmployee } from "@/services/employee";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

/* =========================
   SCHEMA (FIXED)
========================= */
const employeeSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  position: z.string().min(1, "Role is required"),
  department: z.string().optional(),
  salary: z.coerce.number().positive("Salary must be greater than 0"),
  password: z.string().min(6, "Minimum 6 characters"),
  gender: z.enum(["male", "female", "other"]),
});

export default function AddEmployee({ onClose, onSuccess }) {
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "",
      department: "",
      salary: 0,
      password: "",
      gender: "male",
    },
  });

  const gender = watch("gender");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await addEmployee(data); // no manual Number() needed

      toast.success("Employee added successfully");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Employee
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          
          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FormField label="Full Name" error={errors.name?.message}>
              <Input
                placeholder="Enter full name"
                {...register("name")}
              />
            </FormField>

            <FormField label="Email" error={errors.email?.message}>
              <Input
                type="email"
                placeholder="employee@company.com"
                {...register("email")}
              />
            </FormField>

            <FormField label="Role" error={errors.position?.message}>
              <Input
                placeholder="Software Engineer"
                {...register("position")}
              />
            </FormField>

            <FormField label="Department">
              <Input
                placeholder="Engineering / HR / Finance"
                {...register("department")}
              />
            </FormField>

            <FormField label="Salary" error={errors.salary?.message}>
              <Input
                type="number"
                placeholder="50000"
                {...register("salary")}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                {...register("password")}
              />
            </FormField>
          </div>

          {/* GENDER TABS */}
          <div>
            <Label className="mb-2 block">Gender</Label>
            <div className="flex gap-3">
              {["male", "female", "other"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setValue("gender", g)}
                  className={`px-4 py-2 rounded-md border text-sm capitalize transition
                    ${
                      gender === g
                        ? "bg-primary text-white border-primary"
                        : "hover:bg-muted"
                    }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                "Save Employee"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================
   FORM FIELD
========================= */
function FormField({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}