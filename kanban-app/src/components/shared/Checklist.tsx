import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
  onAddItem: (text: string) => void;
  onToggleItem: (id: number) => void;
}

const Checklist = ({ items, onAddItem, onToggleItem }: ChecklistProps) => {
  const [value, setValue] = useState("");

  const handleAddItem = () => {
    const text = value.trim();

    if (!text) return;

    onAddItem(text);
    setValue("");
  };

  return (
    <section className="checklist">
      <h2 className="checklist__title">Checklist</h2>

      <ul className="checklist__list">
        {items.map((item) => (
          <li key={item.id} className="checklist__item">
            <label className="checklist__label">
              <input
                className="checklist__checkbox"
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleItem(item.id)}
              />

              <span className="checklist__text">{item.text}</span>
            </label>
          </li>
        ))}
      </ul>

      <div className="checklist__controls">
        <Input
          value={value}
          placeholder="Add item..."
          className="checklist__input"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddItem();
            }
          }}
        />

        <Button type="button" onClick={handleAddItem}>
          + Add
        </Button>
      </div>
    </section>
  );
};

export default Checklist;
