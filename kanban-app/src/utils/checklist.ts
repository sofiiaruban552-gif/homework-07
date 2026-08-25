import type { ChecklistItem } from "@/types";

export const getChecklistProgress = (items?: ChecklistItem[]) => {
  const safeItems = Array.isArray(items) ? items : [];

  const total = safeItems.length;
  const done = safeItems.filter((i) => i.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return { total, done, percent };
};
