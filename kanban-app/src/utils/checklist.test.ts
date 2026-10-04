import type { ChecklistItem } from "@/types";
import { getChecklistProgress } from "./checklist";

describe("getChecklistProgress", () => {
 
  const items: ChecklistItem[] = [
    { id: 1, text: "First item", done: true },
    { id: 2, text: "Second item", done: false },
    { id: 3, text: "Third item", done: false },
  ];

  it("returns the correct progress", () => {
    expect(getChecklistProgress(items)).toEqual({
      total: 3,
      done: 1,
      percent: 33,
    });
  });

  it("returns zero progress for an empty array", () => {
    expect(getChecklistProgress([])).toEqual({
      total: 0,
      done: 0,
      percent: 0,
    });
  });

  it("returns zero progress when items are undefined", () => {
    expect(getChecklistProgress()).toEqual({
      total: 0,
      done: 0,
      percent: 0,
    });
  });
});
