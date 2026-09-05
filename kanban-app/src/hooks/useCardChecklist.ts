import { useCallback, useState } from "react";

import type { ChecklistItem } from "@/types";

interface UseCardChecklistOptions {
  initialItems?: ChecklistItem[];
}

const useCardChecklist = ({
  initialItems = [],
}: UseCardChecklistOptions = {}) => {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);

  const addItem = useCallback((text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    setItems((currentItems) => [
      ...currentItems,
      {
        id: Date.now(),
        text: trimmedText,
        done: false,
      },
    ]);
  }, []);

  const toggleItem = useCallback((itemId: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              done: !item.done,
            }
          : item,
      ),
    );
  }, []);

  const resetItems = useCallback(() => {
    setItems([]);
  }, []);

  const setChecklist = useCallback((items: ChecklistItem[]) => {
    setItems(items);
  }, []);

  const getChecklistPayload = useCallback(() => items, [items]);

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
