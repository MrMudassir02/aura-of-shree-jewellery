import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email();

const passwordSchema = z
  .string()
  .min(8)
  .max(128);

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),

  email: emailSchema,

  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,

  password: z.string().min(1).max(128),
});

export const verifyEmailOtpSchema = z.object({
  email: emailSchema,

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit code"),
});

export const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit code"),

  password: passwordSchema,
});
