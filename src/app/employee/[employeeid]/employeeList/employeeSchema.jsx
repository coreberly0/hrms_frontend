import * as z from "zod";

export const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  salary: z
    .number({ invalid_type_error: "Salary must be a number" })
    .positive("Salary must be greater than 0"),
  password: z.string().min(6, "Minimum 6 characters"),
});