import z from "zod";

enum UserRole {
  BUYER = "BUYER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}

export const UserRoleTypeSchema = z.nativeEnum(UserRole);

export const loginSchema = z
  .object({
    email: z.email({ message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    role: UserRoleTypeSchema,
  })
  .strict();
