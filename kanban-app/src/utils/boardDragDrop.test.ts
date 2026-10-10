import {
  getCardId,
  getColumnId,
  isCardId,
  isColumnId,
  getDropIndex,
  canMoveToColumn,
} from "./boardDragDrop";

import { columns } from "@/test/fixtures";

const CARD_ID = "card-123";
const COLUMN_ID = "column-123";
const OTHER_COLUMN_ID = "column-456";

describe("getCardId", () => {
  it("returns the numeric card id", () => {
    expect(getCardId(CARD_ID)).toBe(123);
  });
});

describe("getColumnId", () => {
  it("returns the numeric column id", () => {
    expect(getColumnId(OTHER_COLUMN_ID)).toBe(456);
  });
});

describe("isCardId", () => {
  it.each([
    [CARD_ID, true],
    [COLUMN_ID, false],
  ])("returns %s for id %s", (id, expected) => {
    expect(isCardId(id)).toBe(expected);
  });
});

describe("isColumnId", () => {
  it.each([
    [COLUMN_ID, true],
    [CARD_ID, false],
  ])("returns %s for id %s", (id, expected) => {
    expect(isColumnId(id)).toBe(expected);
  });
});

describe("getDropIndex", () => {
  const targetIndex = 2;

  const targetRect = {
    top: 100,
    height: 50,
  };

  it.each([
    ["when there is no active rect", null, targetIndex],
    [
      "when the active center is above the target center",
      { top: 50, height: 40 },
      targetIndex,
    ],
    [
      "when the active center is below the target center",
      { top: 150, height: 40 },
      targetIndex + 1,
    ],
  ])("%s", (_description, activeRect, expected) => {
    expect(
      getDropIndex({
        targetIndex,
        activeRect,
        targetRect,
      }),
    ).toBe(expected);
  });
});

describe("canMoveToColumn", () => {
  it.each([
    ["allows moving within the same column", 10, 10, 100, true],
    [
      "returns false when the destination column does not exist",
      10,
      999,
      0,
      false,
    ],
    ["allows moving to a column without a limit", 10, 20, 0, true],
    [
      "allows moving when destination count is below the limit",
      10,
      20,
      2,
      true,
    ],
    [
      "prevents moving when destination count reaches the limit",
      10,
      20,
      3,
      false,
    ],
    [
      "prevents moving when destination count exceeds the limit",
      10,
      20,
      4,
      false,
    ],
  ])(
    "%s",
    (_description, sourceId, destinationId, destinationCount, expected) => {
      expect(
        canMoveToColumn(columns, sourceId, destinationId, destinationCount),
      ).toBe(expected);
    },
  );
});
