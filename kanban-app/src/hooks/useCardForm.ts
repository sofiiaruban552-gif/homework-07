import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";

import useBoardStore from "@/store/useBoardStore";

import useCardData from "./useCardData";
import useCardChecklist from "./useCardChecklist";

import {
  cardSchema,
  type CardForm,
} from "@/schemas/cardSchema";

interface UseCardFormProps {
  id?: number;
  columnId?: number;
  open: boolean;
  isEdit: boolean;
  onSuccess: () => void;
}

const initialForm: CardForm = {
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
  const { addCard, editCard } = useBoardStore(
    useShallow((state) => ({
      addCard: state.addCard,
      editCard: state.editCard,
    })),
  );

  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    defaultValues: initialForm,
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
        completed: item.done,
      })),
    );
  }, [card, reset, setChecklist]);

  useEffect(() => {
    if (!open || isEdit) {
      return;
    }

    reset(initialForm);
    resetItems();
  }, [open, isEdit, reset, resetItems]);

  const submit = async (data: CardForm) => {
    if (!isEdit && columnId == null) {
      console.error("columnId is required when creating a card");
      return;
    }

    setSaving(true);

    try {
      const checklist = getChecklistPayload();

      if (isEdit && id != null) {
        await editCard(id, {
          title: data.title.trim(),
          description: data.description.trim(),
          assigneeId: data.assignee
            ? Number(data.assignee)
            : null,
          checklist,
        });
      } else {
        await addCard({
          title: data.title.trim(),
          description: data.description.trim(),
          columnId: columnId!,
          order: 1,
          assigneeId: data.assignee
            ? Number(data.assignee)
            : null,
          checklist,
        });
      }

      reset(initialForm);
      resetItems();

      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    reset(initialForm);
    resetItems();
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
