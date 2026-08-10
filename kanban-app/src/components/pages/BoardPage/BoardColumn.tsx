import { useDroppable } from "@dnd-kit/core";
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

const BoardColumn = ({
  column,
  cards,
  users,
}: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: String(column.id),
  });

  const {
    isOpen,
    open,
    close,
  } = useModal();

  const getUser = (id: User["id"] | null) =>
    users.find((user) => user.id === id);

  return (
    <Surface className="column">
      <header className="column__header">
        <h2>{column.title}</h2>

        <span className="column__counter">
          {cards.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={clsx(
          "column__cards",
          isOver && "column__cards--drag-over",
        )}
      >
        {cards.map((card) => (
          <BoardCard
            key={card.id}
            id={card.id}
            card={card}
            assignee={getUser(card.assigneeId)}
          />
        ))}

        <Button
          type="button"
          variant="dashed"
          fullWidth
          onClick={open}
        >
          + Add Card
        </Button>
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

