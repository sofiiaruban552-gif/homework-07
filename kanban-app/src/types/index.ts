export interface User {
  id: number;
  name: string;
  color: string;
}

export interface Column {
  id: number;
  title: string;
  order: number;
  limit: number | null;
}
export interface ChecklistItem {
  id: number;
  text: string;
  done: boolean;
}
export interface Card {
  id: number;
  title: string;
  description: string;
  columnId: Column["id"];
  order: number;
  assigneeId: User["id"] | null;
  createdAt: string;
  checklist: ChecklistItem[];
}

export type NewCard = Omit<Card, "id" | "createdAt">;
