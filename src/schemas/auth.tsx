import { z } from "zod";

const { object, string } = z;

export const signinSchema = object({
  email: string().min(1, "Email is required").email("Invalid email"),
  password: string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = object({
  firstName: string().min(1, "First Name is required"),
  lastName: string().min(1, "Last Name is required"),
  email: string().min(1, "Email is required").email("Invalid email"),
  password: string().min(6, "Password must be at least 6 characters"),
});

export const resetPwdSchema = object({
  email: string().min(1, "Email is required").email("Invalid email"),
});

export type signinSchemaType = z.infer<typeof signinSchema>;

export type signupSchemaType = z.infer<typeof signupSchema>;

export type resetPwdSchemaType = z.infer<typeof resetPwdSchema>;
