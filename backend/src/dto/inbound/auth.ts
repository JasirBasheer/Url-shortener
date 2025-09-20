import z from "zod";
import { signInSchema, signUpSchema } from "@/validators";

export type SignUpDto = z.infer<typeof signUpSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
