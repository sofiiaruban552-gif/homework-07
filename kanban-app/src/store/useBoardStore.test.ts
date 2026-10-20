import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "react-toastify";

import { getCards, getColumns, deleteCard } from "@/api";
import { ERROR_DETAILS, ERROR_MESSAGES } from "@/constants/error-messages";
import { makeCard } from "@/test/factories";
import { cards, columns } from "@/test/fixtures";
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

  it("fetchBoard loads cards and columns", async () => {
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
        vi.mocked(getCards).mockRejectedValue(new Error(ERROR_DETAILS.NETWORK)),
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
    "fetchBoard handles an API error when $description",
    async ({ mockCards, mockColumns }) => {
      mockCards();
      mockColumns();

      await useBoardStore.getState().fetchBoard();

      expect(useBoardStore.getState().error).toBe(ERROR_MESSAGES.LOAD_BOARD);
      expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.LOAD_BOARD);
    },
  );

  it("removeCard restores the card when deletion fails", async () => {
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
