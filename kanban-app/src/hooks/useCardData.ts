import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import type { Card } from "@/types";

import useBoardStore from "@/store/useBoardStore";

interface UseCardDataProps {
  id?: number;
  open: boolean;
  isEdit: boolean;
}

const useCardData = ({
  id,
  open,
  isEdit,
}: UseCardDataProps) => {
  const getCardById = useBoardStore(
    useShallow((state) => state.getCardById),
  );

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !isEdit || id == null) {
      return;
    }

    let cancelled = false;

    const loadCard = async () => {
      setLoading(true);

      try {
        const result = await getCardById(id);

        if (!cancelled) {
          setCard(result);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCard();

    return () => {
      cancelled = true;
    };
  }, [open, isEdit, id, getCardById]);

  const clear = () => {
    setCard(null);
  };

  return {
    card,
    loading,
    clear,
  };
};

export default useCardData;

