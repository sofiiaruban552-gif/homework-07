import { useEffect, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import type { Card, User } from "@/types";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";

import CardModal from "@/components/shared/CardModal";
import Button from "@/components/shared/Button";
import useModal from "@/hooks/useModal";
import useBoardStore from "@/store/useBoardStore";

interface BoardCardProps {
  id: number;
  card: Card;
  assignee?: User;
}

const BoardCard = ({ id, card, assignee }: BoardCardProps) => {
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
    id: `card-${id}`,
  });

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

  useEffect(() => {
    if (!isRemoving) {
      return;
    }

    const timer = setTimeout(() => {
      removeCard(id);
    }, 300);

    return () => clearTimeout(timer);
  }, [isRemoving, id, removeCard]);

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
        style={style}
        className={`card ${isRemoving ? "card--removing" : ""}`}
        {...attributes}
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

        <div {...listeners}>
          <p className="card__description">{card.description}</p>

          <footer className="card__footer">
            <span>#{card.order}</span>

            {assignee && (
              <div
                className="card__avatar"
                style={{
                  backgroundColor: assignee.color,
                }}
                title={assignee.name}
              >
                {assignee.name[0]}
              </div>
            )}
          </footer>
        </div>
      </article>

      <CardModal id={id} open={isOpen} onClose={close} isEdit={true} />
    </>
  );
};

export default BoardCard;
