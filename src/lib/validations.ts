import { z } from "zod";

const emailSchema = z
  .string()
  .pipe(z.string().email({ message: "Invalid email address" }));

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .pipe(
      z.string().min(6, { message: "Password must be at least 6 characters" }),
    ),
});

export const registerSchema = z.object({
  name: z.string().pipe(z.string().min(2, { message: "Name is required" })),
  email: emailSchema,
  password: z.string().pipe(z.string().min(6, { message: "Min 6 characters" })),
  role: z.enum(["CUSTOMER", "PROVIDER"]),
});
