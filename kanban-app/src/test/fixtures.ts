import type { Card, CardForm, ChecklistItem, Column } from "@/types";

export const checklistItems: ChecklistItem[] = [
  { id: 1, text: "First item", done: true },
  { id: 2, text: "Second item", done: false },
  { id: 3, text: "Third item", done: false },
];

export const cards: Card[] = [
  {
    id: 1,
    title: "Fix login",
    description: "Fix authentication bug",
    columnId: 10,
    order: 1,
    assigneeId: 100,
    createdAt: "2026-01-01",
    checklist: [],
  },
  {
    id: 2,
    title: "Add dashboard",
    description: "Create analytics dashboard",
    columnId: 10,
    order: 3,
    assigneeId: 200,
    createdAt: "2026-01-02",
    checklist: [],
  },
  {
    id: 3,
    title: "Improve login page",
    description: "Update login styles",
    columnId: 20,
    order: 5,
    assigneeId: 100,
    createdAt: "2026-01-03",
    checklist: [],
  },
];

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