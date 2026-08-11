import type { MouseEvent, PointerEvent } from "react";
import type { Card, User } from "@/types";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Pencil } from "lucide-react";

import CardModal from "@/components/shared/CardModal";
import Button from "@/components/shared/Button";
import useModal from "@/hooks/useModal";

interface BoardCardProps {
  id: number;
  card: Card;
  assignee?: User;
}

const BoardCard = ({ id, card, assignee }: BoardCardProps) => {
  const { isOpen, open, close } = useModal();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: String(id),
    });

  const handleOpenEdit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    open();
  };

  const handleEditPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <>
      <article ref={setNodeRef} style={style} className="card">
        <div className="card__header" {...listeners} {...attributes}>
          <h3 className="card__title">{card.title}</h3>

          <Button
            type="button"
            variant="secondary"
            small
            className="card__edit"
            onPointerDown={handleEditPointerDown}
            onClick={handleOpenEdit}
          >
            <Pencil size={14} />
          </Button>
        </div>

        <div {...listeners} {...attributes}>
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
