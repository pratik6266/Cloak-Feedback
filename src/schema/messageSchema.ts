  import { z } from 'zod';
  
  export const messageSchema = z.object({
    content: z.string()
    .min(10, {message: "Must be atleast 10 characters"})
    .max(300, {message: "Must be atmost 300 characters"})
  })