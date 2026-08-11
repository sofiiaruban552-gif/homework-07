import { useCallback, useState } from "react";

import type { ChecklistItem } from "@/components/shared/Checklist";

interface UseCardChecklistProps {
  initialItems?: ChecklistItem[];
}

const useCardChecklist = ({
  initialItems = [],
}: UseCardChecklistProps = {}) => {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);

  const addItem = useCallback((text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmedText,
        completed: false,
      },
    ]);
  }, []);

  const toggleItem = useCallback((itemId: number) => {
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
  }, []);

  const resetItems = useCallback(() => {
    setItems([]);
  }, []);

  const setChecklist = useCallback((newItems: ChecklistItem[]) => {
    setItems(newItems);
  }, []);

  const getChecklistPayload = useCallback(() => {
    return items.map((item) => ({
      id: item.id,
      text: item.text,
      done: item.completed,
    }));
  }, [items]);

  return {
    items,
    addItem,
    toggleItem,
    resetItems,
    setChecklist,
    getChecklistPayload,
  };
};

export default useCardChecklist;
