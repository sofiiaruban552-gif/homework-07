import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import Button from "./Button";
import Surface from "./Surface";
import Checklist, { type ChecklistItem } from "./Checklist";
import Select from "./Select";
import Input from "./Input";

import useBoardStore from "@/store/useBoardStore";
import useUsersStore from "@/store/useUsersStore";

interface CardModalProps {
  id?: number;
  columnId?: number;
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
}

interface CardForm {
  title: string;
  description: string;
  assignee: string;
}

const modalRoot = document.getElementById("modal-root");

if (!modalRoot) {
  throw new Error("Modal root element not found.");
}

const initialForm: CardForm = {
  title: "",
  description: "",
  assignee: "",
};

const CardModal = ({
  id,
  columnId,
  open,
  onClose,
  isEdit
}: CardModalProps) => {
  const getCardById = useBoardStore((state) => state.getCardById);
  const addCard = useBoardStore((state) => state.addCard);
  const editCard = useBoardStore((state) => state.editCard);

  const [form, setForm] = useState<CardForm>(initialForm);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [saving, setSaving] = useState(false);

  const { users, loading: usersLoading, fetchUsers } = useUsersStore();

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length, fetchUsers]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      if (!open || !isEdit || id == null) return;

      const card = await getCardById(id);

      if (ignore || !card) return;

      setForm({
        title: card.title,
        description: card.description,
        assignee: String(card.assigneeId ?? ""),
      });

      setItems(
        (card.checklist ?? []).map((item) => ({
          id: item.id,
          text: item.text,
          completed: item.done,
        })),
      );
    };

    load();

    return () => {
      ignore = true;
    };
  }, [open, isEdit, id, getCardById]);

  const assigneeOptions = useMemo(
    () => [
      {
        value: "",
        label: "Select assignee",
      },
      ...users.map((user) => ({
        value: String(user.id),
        label: user.name,
      })),
    ],
    [users],
  );

  const addItem = (text: string) => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        completed: false,
      },
    ]);
  };

  const toggleItem = (itemId: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              completed: !item.completed,
            }
          : item,
      ),
    );
  };

  const handleSubmit = async (
    e: Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0],
  ) => {
    e.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    if (form.description.trim().length < 5) {
      return;
    }

    setSaving(true);

    const checklist = items.map((item) => ({
      id: item.id,
      text: item.text,
      done: item.completed,
    }));

    try {
      if (isEdit && id != null) {
        await editCard(id, {
          title: form.title.trim(),
          description: form.description.trim(),
          assigneeId: form.assignee ? Number(form.assignee) : null,
          checklist,
        });
      } else {
        if (columnId == null) {
          console.error("columnId is required when creating a card");
          return;
        }

        await addCard({
          title: form.title.trim(),
          description: form.description.trim(),
          columnId,
          order: 1,
          assigneeId: form.assignee ? Number(form.assignee) : null,
          checklist,
        });
      }

      setForm(initialForm);
      setItems([]);

      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setItems([]);
    onClose();
  };

  if (!open) {
    return null;
  }

  if (usersLoading) {
    return <p>Loading...</p>;
  }
  return createPortal(
    <div className="modal" onClick={handleClose}>
      <Surface
        className="modal__card"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="secondary"
          className="modal__close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </Button>

        <h2 className="modal__title">
          {isEdit ? "Update card" : "Add new card"}
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            id="card-title"
            label="Title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder="Enter title..."
          />

          <Input
            id="card-description"
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Enter description..."
            error={
              form.description.length > 0 &&
              form.description.length < 5
                ? "Min 5 chars"
                : undefined
            }
          />

          <Select
            id="assignee"
            label="Assignee"
            value={form.assignee}
            options={assigneeOptions}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                assignee: e.target.value,
              }))
            }
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
      </Surface>
    </div>,
    modalRoot,
  );
};

export default CardModal;