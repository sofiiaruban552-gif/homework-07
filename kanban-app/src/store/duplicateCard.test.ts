import { createCard } from "@/api";
import { makeCard } from "@/test/factories";
import useBoardStore from "./useBoardStore";

vi.mock("@/api", () => ({
  createCard: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const original = makeCard({
  id: 1,
  title: "Write docs",
  checklist: [{ id: 1, text: "Draft", done: true }],
});

describe("duplicateCard", () => {
  beforeAll(() => {
    useBoardStore.setState({ cards: [original] });
  });

  it("creates a copy of the card", async () => {
    vi.mocked(createCard).mockResolvedValue(
      makeCard({ id: 2, title: "Write docs (copy)" }),
    );

    await useBoardStore.getState().duplicateCard(1);

    expect(createCard).toHaveBeenCalled();
    expect(useBoardStore.getState().cards).toHaveLength(2);
  });

  it("keeps the original card untouched", () => {
    expect(useBoardStore.getState().cards[0]).toEqual(original);
  });

  it("handles API errors", async () => {
    vi.mocked(createCard).mockRejectedValue(new Error("Network error"));

    await useBoardStore.getState().duplicateCard(1);
  });
});
