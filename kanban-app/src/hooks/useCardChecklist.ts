import { useState } from "react";

import type { ChecklistItem } from "@/components/shared/Checklist";

interface UseCardChecklistProps {
  initialItems?: ChecklistItem[];
}

const useCardChecklist = ({
  initialItems = [],
}: UseCardChecklistProps = {}) => {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);

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

  const resetItems = () => {
    setItems([]);
  };

  const setChecklist = (items: ChecklistItem[]) => {
    setItems(items);
  };

  const getChecklistPayload = () => {
    return items.map((item) => ({
      id: item.id,
      text: item.text,
      done: item.completed,
    }));
  };

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

