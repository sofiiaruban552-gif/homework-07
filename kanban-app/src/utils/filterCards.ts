import type { Card, User } from "@/types";

interface FilterCardsOptions {
  query: string;
  onlyMine: boolean;
  userId: User["id"];
}

const filterCards = (
  cards: Card[],
  { query, onlyMine, userId }: FilterCardsOptions,
): Card[] => {
  const normalizedQuery = query.trim().toLowerCase();

  return cards.filter((card) => {
    const matchesQuery =
      !normalizedQuery ||
      card.title.toLowerCase().includes(normalizedQuery) ||
      card.description.toLowerCase().includes(normalizedQuery);

    const matchesAssignee = !onlyMine || card.assigneeId === userId;

    return matchesQuery && matchesAssignee;
  });
}
export default filterCards;