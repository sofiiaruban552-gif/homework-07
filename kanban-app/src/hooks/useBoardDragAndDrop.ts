import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import useBoardStore from "@/store/useBoardStore";
import {
  canMoveToColumn,
  findCardById,
  findColumnById,
  getActiveCardId,
  getCardId,
  getColumnId,
  getDestinationCards,
  getDropIndex,
  isCardId,
  isColumnId,
  type DropRect,
} from "@/utils/boardDragDrop";
import { toast } from "react-toastify";

const useBoardDragAndDrop = () => {
  const { cards, columns, moveCard } = useBoardStore(
    useShallow((state) => ({
      cards: state.cards,
      columns: state.columns,
      moveCard: state.moveCard,
    })),
  );

  const [activeCardId, setActiveCardId] = useState<number | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const cardId = getActiveCardId(event.active);

    if (cardId === null) {
      return;
    }

    setActiveCardId(cardId);
  };

  const handleDragCancel = () => {
    setActiveCardId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCardId(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const cardId = getActiveCardId(active);

    if (cardId === null) {
      return;
    }

    const overId = String(over.id);

    const draggedCard = findCardById(cards, cardId);

    if (!draggedCard) {
      return;
    }

    const sourceColumnId = draggedCard.columnId;

    if (isCardId(overId)) {
      handleDropOnCard({
        cardId,
        targetId: getCardId(overId),
        sourceColumnId,
        activeRect: active.rect.current.translated,
        targetRect: over.rect,
      });

      return;
    }

    if (isColumnId(overId)) {
      handleDropOnColumn({
        cardId,
        columnId: getColumnId(overId),
        sourceColumnId,
      });
    }
  };

  const handleDropOnCard = ({
    cardId,
    targetId,
    sourceColumnId,
    activeRect,
    targetRect,
  }: {
    cardId: number;
    targetId: number;
    sourceColumnId: number;
    activeRect: DropRect | null;
    targetRect: DropRect;
  }) => {
    if (cardId === targetId) return;

    const targetCard = findCardById(cards, targetId);

    if (!targetCard) return;

    const destinationColumnId = targetCard.columnId;

    const destinationCards = getDestinationCards(
      cards,
      destinationColumnId,
      cardId,
    );

    const targetIndex = destinationCards.findIndex(
      (card) => card.id === targetId,
    );

    if (targetIndex === -1) return;

    if (
      !canMoveToColumn(
        columns,
        sourceColumnId,
        destinationColumnId,
        destinationCards.length,
      )
    ) {
      toast.error("This column has reached its card limit.");

      return;
    }

    const newIndex = getDropIndex({ targetIndex, activeRect, targetRect });

    moveCard(cardId, destinationColumnId, newIndex);
  };

  const handleDropOnColumn = ({
    cardId,
    columnId,
    sourceColumnId,
  }: {
    cardId: number;
    columnId: number;
    sourceColumnId: number;
  }) => {
    const destinationColumn = findColumnById(columns, columnId);

    if (!destinationColumn) return;

    const destinationCards = getDestinationCards(cards, columnId, cardId);

    if (
      !canMoveToColumn(
        columns,
        sourceColumnId,
        columnId,
        destinationCards.length,
      )
    ) {
      toast.error("This column has reached its card limit.");
      return;
    }

    moveCard(cardId, columnId, destinationCards.length);
  };

  const activeCard =
    activeCardId === null ? null : (findCardById(cards, activeCardId) ?? null);

  return {
    activeCardId,
    activeCard,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};

export default useBoardDragAndDrop;
