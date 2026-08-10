import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";

import Button from "./Button";
import Surface from "./Surface";
import Checklist from "./Checklist";
import Select from "./Select";
import Input from "./Input";

import useCardForm from "@/hooks/useCardForm";

import useUsersStore, {
  getAssigneeOptions,
} from "@/store/useUsersStore";

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
  const { users } = useUsersStore(
    useShallow((state) => ({
      users: state.users,
    })),
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
    resetForm();
    onClose();
  };

  if (!open) {
    return null;
  }

  if (cardLoading) {
    return createPortal(
      <div>Loading...</div>,
      modalRoot,
    );
  }

  return createPortal(
    <Surface
      className="modal__card"
      onClick={(event) => event.stopPropagation()}
    >
      {isEdit ? "Update card" : "Add new card"}

      <form onSubmit={handleSubmit(submit)}>
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
          items={items}
          onAddItem={addItem}
          onToggleItem={toggleItem}
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

          <Button
            type="submit"
            fullWidth
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEdit
                ? "Save"
                : "Create"}
          </Button>
        </div>
      </form>
    </Surface>,
    modalRoot,
  );
};

export default CardModal;
 
