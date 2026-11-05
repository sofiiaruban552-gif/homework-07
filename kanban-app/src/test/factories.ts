import type { Card, CardForm, Column } from "@/types/index";

export const makeCard = (overrides: Partial<Card> = {}): Card => ({
  id: 1,
  title: "Test card",
  description: "",
  columnId: 1,
  order: 0,
  assigneeId: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  checklist: [],
  ...overrides,
});

export const makeCardForm = (overrides: Partial<CardForm> = {}): CardForm => ({
  title: "Test card",
  description: "Test description",
  assignee: "",
  ...overrides,
});

export const makeColumns = (): Column[] =>
  [
    { id: 10, limit: null },
    { id: 20, limit: 3 },
    { id: 30, limit: 5 },
  ] as Column[];