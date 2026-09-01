import type { Card, ChecklistItem } from "@/types";
import type { CardForm } from "@/schemas/cardSchema";

export const getInitialCardForm = (
  userId?: number,
): CardForm => ({
  title: "",
  description: "",
  assignee: userId ? String(userId) : "",
});

export const getCardFormPayload = (
  data: CardForm,
  checklist: ChecklistItem[],
) => ({
  title: data.title.trim(),
  description: data.description.trim(),
  assigneeId: data.assignee ? Number(data.assignee) : null,
  checklist,
});

export const getNextCardOrder = (
  cards: Card[],
  columnId: number,
) => {
  const columnCards = cards.filter(
    (card) => card.columnId === columnId,
  );

  return (
    columnCards.reduce(
      (maxOrder, card) => Math.max(maxOrder, card.order),
      0,
    ) + 1
  );
};

