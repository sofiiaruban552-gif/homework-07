import { checklistItems } from "@/test/fixtures";
import { getChecklistProgress } from "./checklist";

describe("getChecklistProgress", () => {
  it.each([
    [
      "returns the correct progress",
      checklistItems,
      { total: 3, done: 1, percent: 33 },
    ],
    [
      "returns zero progress for an empty array",
      [],
      { total: 0, done: 0, percent: 0 },
    ],
    [
      "returns zero progress when items are undefined",
      undefined,
      { total: 0, done: 0, percent: 0 },
    ],
  ])("%s", (_description, items, expected) => {
    expect(getChecklistProgress(items)).toEqual(expected);
  });
});
