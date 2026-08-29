import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import useBoardStore from "@/store/useBoardStore";
import {
  canMoveToColumn,
  getCardId,
  getColumnId,
  getDestinationCards,
  getDropIndex,
  isCardId,
  isColumnId,
  type DropRect,
} from "@/utils/boardDragDrop";

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
    const activeId = String(event.active.id);

    if (!isCardId(activeId)) {
      return;
    }

    setActiveCardId(getCardId(activeId));
  };

  const handleDragCancel = () => {
    setActiveCardId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCardId(null);

    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (!isCardId(activeId)) return;

    const cardId = getCardId(activeId);

    const draggedCard = cards.find((card) => card.id === cardId);

    if (!draggedCard) return;

    if (isCardId(overId)) {
      handleDropOnCard({
        cardId,
        targetId: getCardId(overId),
        sourceColumnId: draggedCard.columnId,
        activeRect: active.rect.current.translated,
        targetRect: over.rect,
      });

      return;
    }

    if (isColumnId(overId)) {
      handleDropOnColumn({
        cardId,
        columnId: getColumnId(overId),
        sourceColumnId: draggedCard.columnId,
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

    const targetCard = cards.find((card) => card.id === targetId);

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
    ) return;

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
    const destinationColumn = columns.find((column) => column.id === columnId);

    if (!destinationColumn) return;

    const destinationCards = getDestinationCards(cards, columnId, cardId);

    if (
      !canMoveToColumn(
        columns,
        sourceColumnId,
        columnId,
        destinationCards.length,
      )
    ) return;
    

    moveCard(cardId, columnId, destinationCards.length);
  };

  const activeCard =
    activeCardId === null
      ? null
      : (cards.find((card) => card.id === activeCardId) ?? null);

  return {
    activeCardId,
    activeCard,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};

export default useBoardDragAndDrop;
