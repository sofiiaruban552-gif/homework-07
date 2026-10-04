import type { Card, CardForm, ChecklistItem, Column } from "@/types";

export const checklistItems: ChecklistItem[] = [
  { id: 1, text: "First item", done: true },
  { id: 2, text: "Second item", done: false },
  { id: 3, text: "Third item", done: false },
];

export const cards: Card[] = [
  {
    id: 1,
    columnId: 10,
    order: 1,
  },
  {
    id: 2,
    columnId: 10,
    order: 3,
  },
  {
    id: 3,
    columnId: 20,
    order: 5,
  },
] as Card[];

export const cardForm: CardForm = {
  title: "Test card",
  description: "Test description",
  assignee: "",
};

export const columns: Column[] = [
  { id: 10, limit: null },
  { id: 20, limit: 3 },
  { id: 30, limit: 5 },
] as Column[];