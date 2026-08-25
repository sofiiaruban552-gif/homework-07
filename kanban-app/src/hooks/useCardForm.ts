import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";

import useBoardStore from "@/store/useBoardStore";
import useAuthStore from "@/store/useAuthStore";

import useCardData from "./useCardData";
import useCardChecklist from "./useCardChecklist";

import { cardSchema, type CardForm } from "@/schemas/cardSchema";

interface UseCardFormProps {
  id?: number;
  columnId?: number;
  open: boolean;
  isEdit: boolean;
  onSuccess: () => void;
}

const INITIAL_FORM: CardForm = {
  title: "",
  description: "",
  assignee: "",
};

const useCardForm = ({
  id,
  columnId,
  open,
  isEdit,
  onSuccess,
}: UseCardFormProps) => {
  const { cards, addCard, editCard } = useBoardStore(
    useShallow((state) => ({
      cards: state.cards,
      addCard: state.addCard,
      editCard: state.editCard,
    })),
  );
  const currentUser = useAuthStore((state) => state.currentUser);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      ...INITIAL_FORM,
      assignee: currentUser ? String(currentUser.id) : "",
    },
  });

  const {
    items,
    addItem,
    toggleItem,
    resetItems,
    setChecklist,
    getChecklistPayload,
  } = useCardChecklist();

  const { card, loading: cardLoading } = useCardData({
    id,
    open,
    isEdit,
  });

  useEffect(() => {
    if (!card) {
      return;
    }

    reset({
      title: card.title,
      description: card.description,
      assignee: String(card.assigneeId ?? ""),
    });

    setChecklist(
      (card.checklist ?? []).map((item) => ({
        id: item.id,
        text: item.text,
        done: item.done,
      })),
    );
  }, [card, reset, setChecklist]);

  useEffect(() => {
    if (!open || isEdit) {
      return;
    }
    reset({
      ...INITIAL_FORM,
      assignee: currentUser ? String(currentUser.id) : "",
    });
    resetItems();
  }, [open, isEdit, currentUser, reset, resetItems]);

  const resetForm = () => {
    reset(INITIAL_FORM);
    resetItems();
  };

  const getFormPayload = (data: CardForm) => ({
    title: data.title.trim(),
    description: data.description.trim(),
    assigneeId: data.assignee ? Number(data.assignee) : null,
    checklist: getChecklistPayload(),
  });

  const getNextOrder = (columnId: number) => {
    const columnCards = cards.filter((card) => card.columnId === columnId);

    return (
      columnCards.reduce(
        (maxOrder, card) => Math.max(maxOrder, card.order),
        0,
      ) + 1
    );
  };

  const submit = async (data: CardForm) => {
    const payload = getFormPayload(data);

    setSaving(true);

    try {
      if (isEdit) {
        if (id == null) {
          console.error("Card id is required when editing a card");
          return;
        }

        await editCard(id, payload);
      } else {
        if (columnId == null) {
          console.error("columnId is required when creating a card");
          return;
        }

        await addCard({
          ...payload,
          columnId,
          order: getNextOrder(columnId),
        });
      }

      resetForm();
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return {
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
  };
};

export default useCardForm;
