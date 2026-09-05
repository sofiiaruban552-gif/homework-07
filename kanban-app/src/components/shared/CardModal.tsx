import { createPortal } from "react-dom";

import Button from "./Button";
import Surface from "./Surface";
import Checklist from "./Checklist";
import Select from "./Select";
import Input from "./Input";

import useCardForm from "@/hooks/useCardForm";

import useUsersStore, { getAssigneeOptions } from "@/store/useUsersStore";
import useBoardStore from "@/store/useBoardStore";
import LoadingSpinner from "./LoadingSpinner";

interface CardModalProps {
  id?: number;
  columnId?: number;
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
}

const modalRoot = document.getElementById("modal-root");

if (!modalRoot) {
  throw new Error("Modal root element not found.");
}

const CardModal = ({
  id,
  columnId,
  open,
  onClose,
  isEdit,
}: CardModalProps) => {
  const users = useUsersStore((state) => state.users);
  const toggleSubtask = useBoardStore((state) => state.toggleSubtask);
  const card = useBoardStore((state) =>
  state.cards.find((card) => card.id === id),
);
  const assigneeOptions = getAssigneeOptions(users);

  const {
    register,
    handleSubmit,
    errors,
    items,
    addItem,
    toggleItem,
    cardLoading,
    saving,
    submit,
    resetForm,
  } = useCardForm({
    id,
    columnId,
    open,
    isEdit,
    onSuccess: onClose,
  });

  const handleClose = () => {
    if (saving) return;

    resetForm();
    onClose();
  };

  if (!open) {
    return null;
  }

  const handleToggleSubtask = (subtaskId: number) => {
    if (id == null) {

      toggleItem(subtaskId);
      return;
    }

    void toggleSubtask(id, subtaskId);
  };

  return createPortal(
    <div className="modal" onClick={handleClose}>
      <Surface
        className="modal__card"
        onClick={(event) => event.stopPropagation()}
      >
        {cardLoading && isEdit ? (
          <LoadingSpinner />
        ) : (
          <>
            <h2>{isEdit ? "Update card" : "Add new card"}</h2>

            <form onSubmit={handleSubmit(submit)} className="modal__form">
              <Input
                id="card-title"
                label="Title"
                placeholder="Enter title..."
                {...register("title")}
                error={errors.title?.message}
              />

              <Input
                id="card-description"
                label="Description"
                placeholder="Enter description..."
                {...register("description")}
                error={errors.description?.message}
              />

              <Select
                id="assignee"
                label="Assignee"
                options={assigneeOptions}
                {...register("assignee")}
              />

              <Checklist
                items={isEdit ? (card?.checklist ?? []) : items}
                onAddItem={isEdit ? undefined : addItem}
                onToggleItem={isEdit ? handleToggleSubtask : toggleItem}
              />

              <div className="modal__actions">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button type="submit" fullWidth disabled={saving}>
                  {saving ? "Saving..." : isEdit ? "Save" : "Create"}
                </Button>
              </div>
            </form>
          </>
        )}
      </Surface>
    </div>,
    modalRoot,
  );
};

export default CardModal;

