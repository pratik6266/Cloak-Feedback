import { z } from 'zod';

export const forgotEmail = z.object({
  email: z.string().email({message: "Invalid Email Address"}),
})

export const forgotOtp = z.object({
  otp: z.string().min(6, {message: "OTP should be 6 character"})
  .max(6, {message: "OTP should be 6 character"})
  .regex(/^\d+$/, {message: "OTP only contain digits"})
})