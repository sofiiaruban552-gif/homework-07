export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: Column["id"];
  order: number;
  assigneeId: User["id"] | null;
  createdAt: string;
}

export type NewCard = Omit<Card, "id" | "createdAt">;
