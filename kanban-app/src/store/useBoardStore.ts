import { create } from "zustand";
import {
  getCards,
  getCardById,
  getColumns,
  createCard,
  updateCard,
  deleteCard,
} from "@/api";

import type { Card, Column, NewCard } from "@/types";

interface BoardStore {
  cards: Card[];
  columns: Column[];
  loading: boolean;
  error: string | null;

  fetchBoard: () => Promise<void>;
  getCardById: (id: number) => Promise<Card | null>;
  addCard: (data: NewCard) => Promise<void>;
  editCard: (id: number, patch: Partial<Card>) => Promise<void>;
  removeCard: (id: number) => Promise<void>;
  moveCard: (id: number, toColumn: number) => Promise<void>;
}

const useBoardStore = create<BoardStore>((set, get) => ({
  cards: [],
  columns: [],
  loading: false,
  error: null,

  fetchBoard: async () => {
    set({ loading: true, error: null });

    try {
      const [cards, columns] = await Promise.all([getCards(), getColumns()]);

      set({
        cards,
        columns,
        loading: false,
      });
    } catch {
      set({
        loading: false,
        error: "Failed to load board",
      });
    }
  },

  getCardById: async (id) => {
    const existing = get().cards.find((card) => card.id === id);

    if (existing) {
      return existing;
    }

    try {
      const card = await getCardById(id);

      set((state) => ({
        cards: [...state.cards, card],
      }));

      return card;
    } catch {
      set({ error: "Failed to load card" });
      return null;
    }
  },

  addCard: async (data) => {
    try {
      const newCard = await createCard(data);

      set((state) => ({
        cards: [...state.cards, newCard],
      }));
    } catch {
      set({ error: "Failed to create card" });
    }
  },

  editCard: async (id, patch) => {
    try {
      const updatedCard = await updateCard(id, patch);

      set((state) => ({
        cards: state.cards.map((card) => (card.id === id ? updatedCard : card)),
      }));
    } catch {
      set({ error: "Failed to update card" });
    }
  },

  removeCard: async (id) => {
    try {
      await deleteCard(id);

      set((state) => ({
        cards: state.cards.filter((card) => card.id !== id),
      }));
    } catch {
      set({ error: "Failed to delete card" });
    }
  },
  moveCard: async (id, toColumn) => {
    const previousCards = get().cards;
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, columnId: toColumn } : card,
      ),
    }));
    try {
      await updateCard(id, { columnId: toColumn });
    } catch {
      set({ cards: previousCards, error: "Failed to move card" });
    }
  },
}));

export default useBoardStore;
