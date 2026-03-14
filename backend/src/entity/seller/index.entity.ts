import { z } from "zod";

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/pdf",
];

export const addListingSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200),

    niche: z.string().trim().min(1, "Niche is required").max(200),

    price: z.coerce
      .number()
      .positive("Price must be greater than 0")
      .max(1000000, "Price too large"),

    metrics: z.string().trim().max(2000).optional(),

    file: z
      .object({
        mimetype: z.string(),
        size: z.number(),
      })
      .passthrough()
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.file) return;

    if (!allowedMimeTypes.includes(data.file.mimetype)) {
      ctx.addIssue({
        path: ["file"],
        code: z.ZodIssueCode.custom,
        message: "Only png, jpeg, svg, pdf files are allowed",
      });
    }

    const maxSize = 5 * 1024 * 1024;

    if (data.file.size > maxSize) {
      ctx.addIssue({
        path: ["file"],
        code: z.ZodIssueCode.custom,
        message: "File size must be less than 5MB",
      });
    }
  });
