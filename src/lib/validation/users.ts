import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  roleId: z.number({ required_error: "Role is required" }),
  isActive: z.boolean().default(true),
})

export type UserFormData = z.infer<typeof userSchema>
