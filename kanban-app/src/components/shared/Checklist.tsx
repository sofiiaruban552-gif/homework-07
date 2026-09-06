import { useState } from "react";
import { checklistItemSchema } from "@/schemas/checklistSchema";

import Button from "./Button";
import Input from "./Input";

import type { ChecklistItem } from "@/types";
import { getChecklistProgress } from "@/utils/checklist";

interface ChecklistProps {
  items: ChecklistItem[];
  onAddItem?: (text: string) => void;
  onToggleItem: (id: number) => void;
}

const Checklist = ({ items, onAddItem, onToggleItem }: ChecklistProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  const { total, done } = getChecklistProgress(items);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (error) {
      setError(undefined);
    }
  };
  
  const handleAddItem = () => {
    const result = checklistItemSchema.safeParse({
      text: value,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }

    onAddItem?.(result.data.text);

    setValue("");
    setError(undefined);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddItem();
    }
  };

  return (
    <section className="checklist">
      <div className="checklist__header">
        <h2 className="checklist__title">Checklist</h2>

        {total > 0 && (
          <span className="checklist__progress">
            {done}/{total}
          </span>
        )}
      </div>

      <ul className="checklist__list">
        {items.map((item) => (
          <li key={item.id} className="checklist__item">
            <label className="checklist__label">
              <input
                className="checklist__checkbox"
                type="checkbox"
                checked={item.done}
                onChange={() => onToggleItem(item.id)}
              />

              <span className="checklist__text">{item.text}</span>
            </label>
          </li>
        ))}
      </ul>

      {onAddItem && (
        <div className="checklist__controls">
          <Input
            value={value}
            placeholder="Add item..."
            className="checklist__input"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            error={error}
          />

          <Button type="button" onClick={handleAddItem}>
            + Add
          </Button>
        </div>
      )}
    </section>
  );
};

export default Checklist;
