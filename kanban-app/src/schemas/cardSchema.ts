import { z } from "zod";

export const CARD_ERROR_MESSAGES = {
  TITLE_REQUIRED: "Title is required",
  DESCRIPTION_MIN_LENGTH: "Description must be at least 5 characters",
} as const;

export const cardSchema = z.object({
  title: z.string().trim().min(1, CARD_ERROR_MESSAGES.TITLE_REQUIRED),

  description: z
    .string()
    .trim()
    .min(5, CARD_ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH),

  assignee: z.string(),
});
