import { z } from "zod";

export const jobSchema = z
  .object({
    title: z
      .string()
      .min(3, "Job title must be at least 3 characters"),

    location: z
      .string()
      .min(2, "Location is required"),

    category: z
      .string()
      .min(1, "Please select a category"),

    jobType: z
      .string()
      .min(1, "Please select a job type"),

    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),

    requirements: z
      .string()
      .min(20, "Requirements must be at least 20 characters"),

    salaryMin: z
      .coerce
      .number()
      .positive("Minimum salary must be greater than 0"),

    salaryMax: z
      .coerce
      .number()
      .positive("Maximum salary must be greater than 0"),
  })

  .refine((data) => data.salaryMax >= data.salaryMin, {
    message: "Maximum salary must be greater than minimum salary",
    path: ["salaryMax"],
  });