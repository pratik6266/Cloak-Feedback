import { z } from 'zod';

export const userNameValidation = z.object({
  userName: z.string()
  .min(2, "UserName must be atleast of 2 characters")
  .max(20, "UserName must be atmost 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "UserName must not contain special character")
})


export const singUpSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(8, {message: "Password should be atleast 8 characters"})
})