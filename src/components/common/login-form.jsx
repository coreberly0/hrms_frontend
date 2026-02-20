"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginEmployee } from "@/services/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function LoginForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onError = (errors) => {
    if (errors.email) toast.error(errors.email.message);
    else if (errors.password) toast.error(errors.password.message);
  };

  const onSubmit = async (data) => {
    try {
      const result = await loginEmployee(data);

      // Save employee info and token
      localStorage.setItem("employeeData", JSON.stringify(result));
      localStorage.setItem("token", result.token);

      toast.success("Login successful!");

      // Redirect to employee dashboard
      router.push(`/employee/${result.id}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <Card className="w-full max-w-md">
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input {...field} type="email" placeholder="Enter email" />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input {...field} type="password" placeholder="Enter password" />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Button type="submit" className="w-full">
                Login
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}