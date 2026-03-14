import { z } from "zod";

const addAdminOrSellerSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  })
  .strict();

export { addAdminOrSellerSchema };
