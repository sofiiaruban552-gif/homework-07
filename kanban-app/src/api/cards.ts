import type { Card, NewCard } from "../types/index";


const API = "http://localhost:4000";

export const getCards = (): Promise<Card[]> =>
  fetch(`${API}/cards?_sort=order`).then((r) => r.json());

export const createCard = (data: NewCard): Promise<Card> =>
  fetch(`${API}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateCard = (id: number, patch: Partial<Card>): Promise<Card> =>
  fetch(`${API}/cards/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).then((r) => r.json());

export const deleteCard = (id: number): Promise<void> =>
  fetch(`${API}/cards/${id}`, { method: "DELETE" }).then(() => undefined);
