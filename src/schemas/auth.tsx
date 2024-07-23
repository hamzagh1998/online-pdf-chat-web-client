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

export const newPwdSchema = object({
  password: string().min(6, "Password must be at least 6 characters"),
  confirmPassword: string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export type signinSchemaType = z.infer<typeof signinSchema>;

export type signupSchemaType = z.infer<typeof signupSchema>;

export type resetPwdSchemaType = z.infer<typeof resetPwdSchema>;

export type newPwdSchemaType = z.infer<typeof newPwdSchema>;
