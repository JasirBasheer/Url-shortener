import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must not exceed 50 characters" }),
  
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: "Please provide a valid email address" }),
  
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const signInSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: "Please provide a valid email address" }),

  password: z.string()
    .min(1, { message: "Password is required" }),
});

