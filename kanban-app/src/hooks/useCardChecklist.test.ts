import { act, renderHook } from "@testing-library/react";

import { checklistItems } from "@/test/fixtures";
import useCardChecklist from "./useCardChecklist";

const renderChecklist = (withInitialItems = false) =>
  renderHook(() =>
    useCardChecklist({
      initialItems: withInitialItems
        ? checklistItems.map((item) => ({ ...item }))
        : [],
    }),
  );

describe("useCardChecklist", () => {
  describe("addItem", () => {
    it("adds an item with trimmed text", () => {
      const { result } = renderChecklist();

      act(() => {
        result.current.addItem("  New item  ");
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual({
        id: expect.any(Number),
        text: "New item",
        done: false,
      });
    });

    it.each(["", "   ", "\t\n"])(
      "ignores empty or whitespace-only text: %j",
      (text) => {
        const { result } = renderChecklist();

        act(() => {
          result.current.addItem(text);
        });

        expect(result.current.items).toEqual([]);
      },
    );
  });

  describe("toggleItem", () => {
    it.each([
      { id: 1, expectedDone: false },
      { id: 2, expectedDone: true },
      { id: 3, expectedDone: true },
    ])("toggles item $id to done=$expectedDone", ({ id, expectedDone }) => {
      const { result } = renderChecklist(true);

      act(() => {
        result.current.toggleItem(id);
      });

      const item = result.current.items.find((item) => item.id === id);

      expect(item?.done).toBe(expectedDone);
    });

    it("does not change items when the ID does not exist", () => {
      const { result } = renderChecklist(true);
      const originalItems = result.current.items;

      act(() => {
        result.current.toggleItem(999);
      });

      expect(result.current.items).toEqual(originalItems);
    });

    it("toggles the same item back to its original state", () => {
      const { result } = renderChecklist(true);
      const originalItems = result.current.items.map((item) => ({ ...item }));

      act(() => {
        result.current.toggleItem(1);
        result.current.toggleItem(1);
      });

      expect(result.current.items).toEqual(originalItems);
    });
  });

  describe("resetItems", () => {
    it("removes all items", () => {
      const { result } = renderChecklist(true);

      act(() => {
        result.current.resetItems();
      });

      expect(result.current.items).toEqual([]);
    });

    it("does nothing when the checklist is already empty", () => {
      const { result } = renderChecklist();

      act(() => {
        result.current.resetItems();
      });

      expect(result.current.items).toEqual([]);
    });
  });
});
