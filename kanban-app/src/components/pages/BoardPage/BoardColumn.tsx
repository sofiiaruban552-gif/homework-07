import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import clsx from "clsx";

import type { Card, Column, User } from "@/types";

import useModal from "@/hooks/useModal";

import Surface from "@/components/shared/Surface";
import Button from "@/components/shared/Button";
import BoardCard from "./BoardCard";
import CardModal from "@/components/shared/CardModal";

interface ColumnProps {
  column: Column;
  cards: Card[];
  users: User[];
}

const BoardColumn = ({ column, cards, users }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
  });

  const { isOpen, open, close } = useModal();

  const getUser = (id: User["id"] | null) =>
    users.find((user) => user.id === id);

  const sortedCards = [...cards].sort((a, b) => a.order - b.order);

  const count = sortedCards.length;

  const isFull = column.limit !== null && count >= column.limit;

  return (
    <Surface className="column">
      <header className="column__header">
        <h2>{column.title}</h2>

        <span
          className={clsx("column__counter", isFull && "column__counter--full")}
        >
          {count}

          {column.limit !== null && ` / ${column.limit}`}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={clsx("column__cards", isOver && "column__cards--drag-over")}
      >
        <SortableContext
          items={sortedCards.map((card) => `card-${card.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {sortedCards.map((card) => (
            <BoardCard
              key={card.id}
              id={card.id}
              card={card}
              assignee={getUser(card.assigneeId)}
            />
          ))}
        </SortableContext>

        {!isFull && (
          <div className="column__drop-zone">
            <Button type="button" variant="dashed" fullWidth onClick={open}>
              + Add Card
            </Button>
          </div>
        )}
      </div>

      <CardModal
        open={isOpen}
        onClose={close}
        isEdit={false}
        columnId={column.id}
      />
    </Surface>
  );
};

export default BoardColumn;
