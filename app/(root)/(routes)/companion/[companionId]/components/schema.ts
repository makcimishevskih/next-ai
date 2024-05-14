import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(1, {
    message: "Username must be at least 1 characters."
  }),
  description: z.string().min(1, {
    message: "Description must be at least 1 characters."
  }),
  instructions: z.string().min(200, {
    message: "Instructions must be at least 200 characters."
  }),
  seed: z.string().min(200, {
    message: "seed must be at least 200 characters."
  }),
  src: z.string().min(1, {
    message: "Image is required"
  }),
  categoryId: z.string().min(1, {
    message: 'Category Id is required'
  })
});