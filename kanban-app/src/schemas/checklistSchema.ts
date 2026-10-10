import { z } from "zod";
export const CHECKLIST_ITEM_ERROR_MESSAGES = {
  TEXT_REQUIRED: "Checklist item is required",
} as const;

export const checklistItemSchema = z.object({
  text: z.string().trim().min(1, CHECKLIST_ITEM_ERROR_MESSAGES.TEXT_REQUIRED),
});

export type ChecklistItemForm = z.infer<typeof checklistItemSchema>;
