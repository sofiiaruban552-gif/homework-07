import { z } from "zod";

export const checklistItemSchema = z.object({
  text: z.string().trim().min(1, "Checklist item is required"),
});

export type ChecklistItemForm = z.infer<typeof checklistItemSchema>;
