
import { checklistItems } from "@/test/fixtures";
import { getChecklistProgress } from "./checklist";

describe("getChecklistProgress", () => {

  it("returns the correct progress", () => {
    expect(getChecklistProgress(checklistItems)).toEqual({
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
