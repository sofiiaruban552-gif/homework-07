import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";

import {
  getCards,
  getCardById,
  getColumns,
  createCard,
  updateCard,
  deleteCard,
} from "@/api";
import { ERROR_DETAILS, ERROR_MESSAGES } from "@/constants/error-messages";
import { makeCard } from "@/test/factories";
import { cards, checklistItems, columns } from "@/test/fixtures";
import type { NewCard } from "@/types";
import useBoardStore from "./useBoardStore";

vi.mock("@/api", () => ({
  getCards: vi.fn(),
  getCardById: vi.fn(),
  getColumns: vi.fn(),
  createCard: vi.fn(),
  updateCard: vi.fn(),
  deleteCard: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

describe("useBoardStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useBoardStore.setState({
      cards: [],
      columns: [],
      loading: false,
      error: null,
    });
  });

  describe("fetchBoard", () => {
    it("loads cards and columns", async () => {
      vi.mocked(getCards).mockResolvedValue(cards);
      vi.mocked(getColumns).mockResolvedValue(columns);

      await useBoardStore.getState().fetchBoard();

      expect(useBoardStore.getState().cards).toEqual(cards);
      expect(useBoardStore.getState().columns).toEqual(columns);
      expect(useBoardStore.getState().error).toBeNull();
    });

    it.each([
      {
        description: "cards request fails",
        mockCards: () =>
          vi
            .mocked(getCards)
            .mockRejectedValue(new Error(ERROR_DETAILS.NETWORK)),
        mockColumns: () => vi.mocked(getColumns).mockResolvedValue(columns),
      },
      {
        description: "columns request fails",
        mockCards: () => vi.mocked(getCards).mockResolvedValue(cards),
        mockColumns: () =>
          vi
            .mocked(getColumns)
            .mockRejectedValue(new Error(ERROR_DETAILS.NETWORK)),
      },
    ])(
      "handles an API error when $description",
      async ({ mockCards, mockColumns }) => {
        mockCards();
        mockColumns();

        await useBoardStore.getState().fetchBoard();

        expect(useBoardStore.getState().error).toBe(ERROR_MESSAGES.LOAD_BOARD);
        expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.LOAD_BOARD);
      },
    );
  });

  describe("removeCard", () => {
    it("restores the card when deletion fails", async () => {
      const testCards = [
        makeCard({ id: 1, title: "Card 1" }),
        makeCard({ id: 2, title: "Card 2" }),
        makeCard({ id: 3, title: "Card 3" }),
      ];

      useBoardStore.setState({ cards: testCards });

      vi.mocked(deleteCard).mockRejectedValue(new Error(ERROR_DETAILS.DELETE));

      const promise = useBoardStore.getState().removeCard(1);

      expect(useBoardStore.getState().cards.map((card) => card.id)).toEqual([
        2, 3,
      ]);

      await promise;

      expect(useBoardStore.getState().cards).toEqual(testCards);
      expect(useBoardStore.getState().error).toBe(ERROR_MESSAGES.DELETE_CARD);
    });
  });

  describe("getCardById", () => {
    it("returns an existing card without making an API request", async () => {
      const card = makeCard({ id: 1, title: "Card 1" });

      useBoardStore.setState({ cards: [card] });

      const result = await useBoardStore.getState().getCardById(1);

      expect(result).toEqual(card);
      expect(getCardById).not.toHaveBeenCalled();
    });

    it("fetches a card and adds it to the store", async () => {
      const card = makeCard({ id: 1, title: "Card 1" });

      vi.mocked(getCardById).mockResolvedValue(card);

      const result = await useBoardStore.getState().getCardById(1);

      expect(getCardById).toHaveBeenCalledWith(1);
      expect(result).toEqual(card);
      expect(useBoardStore.getState().cards).toEqual([card]);
    });

    it("sets an error when fetching a card fails", async () => {
      vi.mocked(getCardById).mockRejectedValue(
        new Error(ERROR_DETAILS.NETWORK),
      );

      const result = await useBoardStore.getState().getCardById(1);

      expect(result).toBeNull();
      expect(useBoardStore.getState().error).toBe(ERROR_MESSAGES.LOAD_CARD);
      expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.LOAD_CARD);
      expect(useBoardStore.getState().cards).toEqual([]);
    });
  });

  describe("addCard", () => {
    const data: NewCard = {
      title: "New Card",
      description: "Card description",
      columnId: 1,
      order: 1,
      assigneeId: null,
      checklist: [],
    };

    it("creates a card and adds it to the store", async () => {
      const newCard = makeCard({ id: 1, title: "New Card" });

      vi.mocked(createCard).mockResolvedValue(newCard);

      await useBoardStore.getState().addCard(data);

      expect(createCard).toHaveBeenCalledWith(data);
      expect(useBoardStore.getState().cards).toEqual([newCard]);
    });

    it("sets an error when creating a card fails", async () => {
      vi.mocked(createCard).mockRejectedValue(new Error(ERROR_DETAILS.NETWORK));

      await useBoardStore.getState().addCard(data);

      expect(useBoardStore.getState().error).toBe(ERROR_MESSAGES.CREATE_CARD);
      expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.CREATE_CARD);
      expect(useBoardStore.getState().cards).toEqual([]);
    });
  });

  describe("editCard", () => {
    it("updates an existing card in the store", async () => {
      const card = makeCard({ id: 1, title: "Old title" });
      const updatedCard = makeCard({
        id: 1,
        title: "Updated title",
      });
      const patch = { title: "Updated title" };

      useBoardStore.setState({ cards: [card] });

      vi.mocked(updateCard).mockResolvedValue(updatedCard);

      await useBoardStore.getState().editCard(1, patch);

      expect(updateCard).toHaveBeenCalledWith(1, patch);
      expect(useBoardStore.getState().cards).toEqual([updatedCard]);
    });

    it("preserves other cards when updating a card", async () => {
      const card = makeCard({ id: 1, title: "Card 1" });
      const anotherCard = makeCard({ id: 2, title: "Card 2" });
      const updatedCard = makeCard({
        id: 1,
        title: "Updated Card 1",
      });

      useBoardStore.setState({ cards: [card, anotherCard] });

      vi.mocked(updateCard).mockResolvedValue(updatedCard);

      await useBoardStore.getState().editCard(1, {
        title: "Updated Card 1",
      });

      expect(useBoardStore.getState().cards).toEqual([
        updatedCard,
        anotherCard,
      ]);
    });

    it("sets an error when updating a card fails", async () => {
      const card = makeCard({ id: 1, title: "Card 1" });

      useBoardStore.setState({ cards: [card] });

      vi.mocked(updateCard).mockRejectedValue(new Error(ERROR_DETAILS.NETWORK));

      await useBoardStore.getState().editCard(1, {
        title: "Updated Card",
      });

      expect(useBoardStore.getState().error).toBe(ERROR_MESSAGES.UPDATE_CARD);
      expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.UPDATE_CARD);
      expect(useBoardStore.getState().cards).toEqual([card]);
    });
  });

  describe("moveCard", () => {
    it("moves a card to another column and updates card orders", async () => {
      const card1 = makeCard({ id: 1, columnId: 1, order: 1 });
      const card2 = makeCard({ id: 2, columnId: 1, order: 2 });
      const card3 = makeCard({ id: 3, columnId: 2, order: 1 });
      const card4 = makeCard({ id: 4, columnId: 2, order: 2 });

      useBoardStore.setState({
        cards: [card1, card2, card3, card4],
      });

      vi.mocked(updateCard).mockResolvedValue(makeCard());

      await useBoardStore.getState().moveCard(1, 2, 1);

      expect(useBoardStore.getState().cards).toEqual([
        { ...card1, columnId: 2, order: 2 },
        { ...card2, order: 1 },
        card3,
        { ...card4, order: 3 },
      ]);

      expect(updateCard).toHaveBeenCalledTimes(4);
      expect(updateCard).toHaveBeenCalledWith(2, {
        columnId: 1,
        order: 1,
      });
      expect(updateCard).toHaveBeenCalledWith(1, {
        columnId: 2,
        order: 2,
      });
      expect(updateCard).toHaveBeenCalledWith(3, {
        columnId: 2,
        order: 1,
      });
      expect(updateCard).toHaveBeenCalledWith(4, {
        columnId: 2,
        order: 3,
      });
    });

    it("reorders cards within the same column", async () => {
      const card1 = makeCard({ id: 1, columnId: 1, order: 1 });
      const card2 = makeCard({ id: 2, columnId: 1, order: 2 });
      const card3 = makeCard({ id: 3, columnId: 1, order: 3 });

      useBoardStore.setState({
        cards: [card1, card2, card3],
      });

      vi.mocked(updateCard).mockResolvedValue(makeCard());

      await useBoardStore.getState().moveCard(1, 1, 2);

      expect(useBoardStore.getState().cards).toEqual([
        { ...card1, order: 3 },
        { ...card2, order: 1 },
        { ...card3, order: 2 },
      ]);

      expect(updateCard).toHaveBeenCalledTimes(3);
    });

    it("restores previous cards when updating fails", async () => {
      const testCards = [
        makeCard({ id: 1, columnId: 1, order: 1 }),
        makeCard({ id: 2, columnId: 1, order: 2 }),
        makeCard({ id: 3, columnId: 2, order: 1 }),
      ];

      useBoardStore.setState({ cards: testCards });

      vi.mocked(updateCard).mockRejectedValue(new Error(ERROR_DETAILS.NETWORK));

      await useBoardStore.getState().moveCard(1, 2, 0);

      expect(useBoardStore.getState().cards).toEqual(testCards);
      expect(useBoardStore.getState().error).toBe(ERROR_MESSAGES.MOVE_CARD);
      expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.MOVE_CARD);
    });
  });

  describe("toggleSubtask", () => {
    it("toggles a subtask's done status", async () => {
      const card = makeCard({
        id: 1,
        checklist: checklistItems,
      });

      useBoardStore.setState({ cards: [card] });
      vi.mocked(updateCard).mockResolvedValue(makeCard());

      await useBoardStore.getState().toggleSubtask(1, 1);

      const expectedChecklist = [
        { ...checklistItems[0], done: false },
        checklistItems[1],
        checklistItems[2],
      ];

      expect(useBoardStore.getState().cards[0].checklist).toEqual(
        expectedChecklist,
      );

      expect(updateCard).toHaveBeenCalledWith(1, {
        checklist: expectedChecklist,
      });
    });

    it("does nothing when the card does not exist", async () => {
      const card = makeCard({
        id: 1,
        checklist: checklistItems,
      });

      useBoardStore.setState({ cards: [card] });

      await useBoardStore.getState().toggleSubtask(999, 1);

      expect(useBoardStore.getState().cards).toEqual([card]);
      expect(updateCard).not.toHaveBeenCalled();
    });

    it("restores the previous checklist when updating fails", async () => {
      const card = makeCard({
        id: 1,
        checklist: checklistItems,
      });

      useBoardStore.setState({ cards: [card] });

      vi.mocked(updateCard).mockRejectedValue(new Error(ERROR_DETAILS.NETWORK));

      await useBoardStore.getState().toggleSubtask(1, 1);

      expect(useBoardStore.getState().cards[0].checklist).toEqual(
        checklistItems,
      );
      expect(useBoardStore.getState().error).toBe(
        ERROR_MESSAGES.TOGGLE_SUBTASK,
      );
      expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.TOGGLE_SUBTASK);
    });
  });
});
