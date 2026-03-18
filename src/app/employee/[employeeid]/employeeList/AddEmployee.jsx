"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addEmployee } from "@/services/employee";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { User, Mail, Briefcase, DollarSign, Lock } from "lucide-react";

export default function AddEmployee({ open, onClose, onSuccess }) {
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { gender: "" },
  });

  const gender = watch("gender");

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await addEmployee(data);

      toast.success("Employee added successfully");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95%] sm:max-w-2xl rounded-2xl p-4 sm:p-6">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl font-bold">
            Add New Employee
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Fill all required fields before submitting
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* BASIC INFO */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">
              Basic Information
            </h3>

            {/* ✅ RESPONSIVE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* NAME */}
              <div>
                <Label>Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Enter name"
                    {...register("name", { required: "Name is required" })}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <Label>Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    className="pl-9"
                    placeholder="Enter email"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* JOB INFO */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3">
              Job Details
            </h3>

            {/* ✅ RESPONSIVE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* POSITION */}
              <div>
                <Label>Position</Label>
                <div className="relative mt-1">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Developer / Manager"
                    {...register("position", { required: "Position is required" })}
                  />
                </div>
              </div>

              {/* DEPARTMENT */}
              <div>
                <Label>Department</Label>
                <Input
                  className="mt-1"
                  placeholder="HR / IT / Finance"
                  {...register("department")}
                />
              </div>

              {/* SALARY */}
              <div>
                <Label>Salary</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    className="pl-9"
                    placeholder="Enter salary"
                    {...register("salary", {
                      required: "Salary is required",
                    })}
                  />
                </div>
              </div>

              {/* GENDER */}
              <div>
                <Label>Gender</Label>

                <input
                  type="hidden"
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                />

                {/* ✅ MOBILE STACK */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["male", "female", "other"].map((g) => (
                    <Button
                      key={g}
                      type="button"
                      variant={gender === g ? "default" : "outline"}
                      className="text-xs sm:text-sm"
                      onClick={() =>
                        setValue("gender", g, { shouldValidate: true })
                      }
                    >
                      {g === "male" && "👨"}
                      {g === "female" && "👩"}
                      {g === "other" && "⚧"}
                    </Button>
                  ))}
                </div>

                {errors.gender && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <Label>Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                className="pl-9"
                placeholder="Enter password"
                {...register("password", { required: true })}
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Employee"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}