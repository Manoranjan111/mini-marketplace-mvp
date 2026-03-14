import { z } from "zod";

const signupBuyerSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  })
  .strict();

const placeOrderSchema = z.object({
  productId: z.string().min(1, { message: "Product ID is required" }),
  quantity: z.number().int().min(1, { message: "Quantity is required" }),
});

export { placeOrderSchema, signupBuyerSchema };
