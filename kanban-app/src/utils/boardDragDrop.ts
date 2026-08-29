import type { Card, Column } from "@/types";

const CARD_PREFIX = "card-";
const COLUMN_PREFIX = "column-";
const HALF_SIZE = 2;

export type DropRect = {
  top: number;
  height: number;
};

export const getCardId = (id: string) => Number(id.replace(CARD_PREFIX, ""));

export const getColumnId = (id: string) =>
  Number(id.replace(COLUMN_PREFIX, ""));

export const isCardId = (id: string) => id.startsWith(CARD_PREFIX);

export const isColumnId = (id: string) => id.startsWith(COLUMN_PREFIX);

export const getDropIndex = ({
  targetIndex,
  activeRect,
  targetRect,
}: {
  targetIndex: number;
  activeRect: DropRect | null;
  targetRect: DropRect;
}) => {
  if (!activeRect) return targetIndex;

  const activeCenter = activeRect.top + activeRect.height / HALF_SIZE;
  const targetCenter = targetRect.top + targetRect.height / HALF_SIZE;

  return activeCenter > targetCenter ? targetIndex + 1 : targetIndex;
};

export const getDestinationCards = (
  cards: Card[],
  columnId: number,
  excludedCardId: number,
) => {
  return cards
    .filter((card) => card.columnId === columnId && card.id !== excludedCardId)
    .sort((a, b) => a.order - b.order);
};

export const canMoveToColumn = (
  columns: Column[],
  sourceColumnId: number,
  destinationColumnId: number,
  destinationCount: number,
) => {
  if (sourceColumnId === destinationColumnId) {
    return true;
  }

  const destinationColumn = columns.find(
    (column) => column.id === destinationColumnId,
  );

  if (!destinationColumn) {
    return false;
  }

  if (destinationColumn.limit === null) {
    return true;
  }

  return destinationCount < destinationColumn.limit;
};
