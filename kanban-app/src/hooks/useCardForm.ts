import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";

import useBoardStore from "@/store/useBoardStore";
import useAuthStore from "@/store/useAuthStore";

import useCardData from "./useCardData";
import useCardChecklist from "./useCardChecklist";

import { cardSchema, type CardForm } from "@/schemas/cardSchema";
import {
  getCardFormPayload,
  getInitialCardForm,
  getNextCardOrder,
} from "@/utils/cardForm";

interface UseCardFormProps {
  id?: number;
  columnId?: number;
  open: boolean;
  isEdit: boolean;
  onSuccess: () => void;
}

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
    defaultValues: getInitialCardForm(currentUser?.id),
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
    if (!open || isEdit) return;

    reset(getInitialCardForm(currentUser?.id));
    resetItems();
  }, [open, isEdit, currentUser, reset, resetItems]);

  const resetForm = () => {
    reset(getInitialCardForm(currentUser?.id));
    resetItems();
  };

  const submit = async (data: CardForm) => {
    const payload = getCardFormPayload(
      data,
      getChecklistPayload(),
    );

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
          console.error("Column id is required when creating a card");
          return;
        }

        await addCard({
          ...payload,
          columnId,
          order: getNextCardOrder(cards, columnId),
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

