import { z } from "zod";

export const searchJobSchema = z.object({
  keyword: z
    .string()
    .trim()
    .max(100, "Keyword is too long")
    .optional()
    .or(z.literal("")),

  location: z
    .string()
    .trim()
    .max(100, "Location is too long")
    .optional()
    .or(z.literal("")),
});