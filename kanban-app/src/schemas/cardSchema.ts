import { CARD_ERROR_MESSAGES } from "@/constants/error-messages";
import { z } from "zod";

export const cardSchema = z.object({
  title: z.string().trim().min(1, CARD_ERROR_MESSAGES.TITLE_REQUIRED),

  description: z
    .string()
    .trim()
    .min(5, CARD_ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH),

  assignee: z.string(),
});
