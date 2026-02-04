"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import sampleImg from "@/components/asset/sample.jpg";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/* ---------------- VALIDATION ---------------- */
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export function LoginForm({ className, ...props }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* ---------------- FRONTEND VALIDATION ERROR ---------------- */
  const onError = (errors) => {
    if (errors.email) {
      toast.error(errors.email.message);
      return;
    }

    if (errors.password) {
      toast.error(errors.password.message);
      return;
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Email or password is incorrect");
        return;
      }

      const result = await res.json();

      // Save HR data in localStorage or context
      localStorage.setItem("hrData", JSON.stringify(result));

      // ✅ SET COOKIE FOR MIDDLEWARE
      document.cookie = `role=${result.role}; path=/`;
      document.cookie = `name=${result.name}; path=/`;
      document.cookie = `hrId=${result.id}; path=/`;

      toast.success("Login successful");

      if (result.role === "superadmin") {
        router.push("/superadmin/dashboard");
      }

      if (result.role === "hr") {
        router.push(`/hr/${result.id}`);
      }

      if (result.role === "employee") {
        router.push(
          `/employee/dashboard?companyId=${result.companyId}&companyName=${result.companyName}`,
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error, try again");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8 space-y-4"
            onSubmit={form.handleSubmit(onSubmit, onError)}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">Login to your account</p>
              </div>

              {/* EMAIL */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="email@company.com"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* PASSWORD */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel>Password</FieldLabel>
                      <a className="ml-auto text-sm underline hover:opacity-80">
                        Forgot password?
                      </a>
                    </div>
                    <Input {...field} type="password" />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </FieldGroup>
          </form>

          {/* IMAGE */}
          <div className="bg-muted hidden md:block relative">
            <img
              src={sampleImg.src}
              alt="Login"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="text-center px-6">
        By clicking continue, you agree to our <a href="#">Terms</a> &{" "}
        <a href="#">Privacy Policy</a>
      </FieldDescription>
    </div>
  );
}
