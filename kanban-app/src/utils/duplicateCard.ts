import type { Card, NewCard } from "@/types";

export const COPY_SUFFIX = " (copy)";

export const buildDuplicate = (card: Card): NewCard => {
  const checklist = card.checklist;

  // a copy starts with a fresh checklist
  checklist.forEach((item) => {
    item.done = false;
  });

  return {
    title: `${card.title}${COPY_SUFFIX}`,
    description: card.description,
    columnId: card.columnId,
    order: card.order + 1,
    assigneeId: card.assigneeId,
    checklist,
  };
};

export const highlightCopySuffix = (title: string) =>
  title.endsWith(COPY_SUFFIX)
    ? `${title.slice(0, -COPY_SUFFIX.length)}<em class="card__copy-label">${COPY_SUFFIX}</em>`
    : title;
