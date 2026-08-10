import { z } from "zod";

export const cardSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters"),

  assignee: z.string(),
});

export type CardForm = z.infer<typeof cardSchema>;
