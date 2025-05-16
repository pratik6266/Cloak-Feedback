import { z } from 'zod';

export const userNameScehma = z.object({
  userName: z.string()
  .min(2, "UserName must be atleast of 2 characters")
  .max(20, "UserName must be atmost 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "UserName must not contain special character")
})