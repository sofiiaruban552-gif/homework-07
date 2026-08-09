import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

import type { Card, Column, User } from "@/types";

import clsx from "clsx";
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
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: String(column.id),
  });

  const getUser = (id: User["id"] | null) =>
    users.find((user) => user.id === id);

  const handleAddCard = () => {
    setIsCardModalOpen(true);
  };

  const handleCloseCardModal = () => {
    setIsCardModalOpen(false);
  };

  return (
    <Surface className="column">
      <header className="column__header">
        <h2 className="column__title">{column.title}</h2>

        <span className="column__counter">{cards.length}</span>
      </header>

      <div
        ref={setNodeRef}
        className={clsx("column__cards", isOver && "column__cards--drag-over")}
      >
        {cards.map((card) => (
          <BoardCard
            key={card.id}
            id={card.id}
            card={card}
            assignee={getUser(card.assigneeId)}
          />
        ))}

        <Button variant="dashed" fullWidth onClick={handleAddCard}>
          + Add Card
        </Button>
      </div>
      <CardModal
        open={isCardModalOpen}
        onClose={handleCloseCardModal}
        isEdit={false}
        columnId={column.id}
      />
    </Surface>
  );
};

export default BoardColumn;
