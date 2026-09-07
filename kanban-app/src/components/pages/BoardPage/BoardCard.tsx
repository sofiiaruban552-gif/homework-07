import { useState } from "react";
import type { MouseEvent, PointerEvent } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";

import type { Card, User } from "@/types";

import Button from "@/components/shared/Button";
import CardModal from "@/components/shared/CardModal";

import useModal from "@/hooks/useModal";
import useBoardStore from "@/store/useBoardStore";

import { getChecklistProgress } from "@/utils/checklist";
import Avatar from "@/components/shared/Avatar";

interface BoardCardProps {
  card: Card;
  assignee?: User;
}

const BoardCard = ({ card, assignee }: BoardCardProps) => {
  const { isOpen, open, close } = useModal();

  const removeCard = useBoardStore((state) => state.removeCard);

  const [isRemoving, setIsRemoving] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `card-${card.id}`,
  });

  const { total, done, percent } = getChecklistProgress(card.checklist);

  const handleOpenEdit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    open();
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsRemoving(true);
  };

  const handleButtonPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handleAnimationEnd = () => {
    if (isRemoving) {
      void removeCard(card.id);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <>
      <article
        ref={setNodeRef}
        {...attributes}
        style={style}
        onAnimationEnd={handleAnimationEnd}
        className={`card ${isRemoving ? "card--removing" : ""}`}
      >
        <div className="card__header" {...listeners}>
          <h3 className="card__title">{card.title}</h3>

          <div className="card__actions">
            <Button
              type="button"
              variant="secondary"
              small
              className="card__edit"
              onPointerDown={handleButtonPointerDown}
              onClick={handleOpenEdit}
            >
              <Pencil size={14} />
            </Button>

            <Button
              type="button"
              variant="secondary"
              small
              className="card__delete"
              onPointerDown={handleButtonPointerDown}
              onClick={handleDelete}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        <div className="card__content" {...listeners}>
          <p className="card__description">{card.description}</p>

          {total > 0 && (
            <div className="card__progress-row">
              <div className="card__progress-bar">
                <div
                  className="card__progress-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <span className="card__progress-text">
                {done}/{total}
              </span>
            </div>
          )}

          <footer className="card__footer">
            <span>#{card.order}</span>

            {assignee && <Avatar user={assignee} className="card__avatar" />}
          </footer>
        </div>
      </article>

      <CardModal id={card.id} open={isOpen} onClose={close} isEdit />
    </>
  );
};

export default BoardCard;
