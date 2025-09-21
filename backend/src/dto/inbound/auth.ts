import { signInSchema, signUpSchema } from "../../validators";
import z from "zod";

export type SignUpDto = z.infer<typeof signUpSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
