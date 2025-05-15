import { z } from 'zod';

export const resetPasswordSchema = z.object({
  old: z.string().min(8, {message: "Password should be atleast 8 characters"}),
  one: z.string().min(8, {message: "Password should be atleast 8 characters"}),
  two: z.string().min(8, {message: "Password should be atleast 8 characters"})
})