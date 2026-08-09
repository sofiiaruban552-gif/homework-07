import { api } from "./client";
import type { Card, NewCard, User, Column } from "@/types";

export const getCards = () => api.get<Card[]>("/cards?_sort=order");

export const getCardById = (id: number) => api.get<Card>(`/cards/${id}`);

export const createCard = (data: NewCard) => api.post<Card>("/cards", data);

export const updateCard = (id: number, patch: Partial<Card>) =>
  api.patch<Card>(`/cards/${id}`, patch);

export const deleteCard = (id: number) => api.delete<void>(`/cards/${id}`);

export const getUsers = () => api.get<User[]>("/users");

export const getColumns = () => api.get<Column[]>("/columns");
