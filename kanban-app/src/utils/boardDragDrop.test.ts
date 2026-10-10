import {
  getCardId,
  getColumnId,
  isCardId,
  isColumnId,
  findCardById,
  findColumnById,
  getActiveCardId,
  getDropIndex,
  getDestinationCards,
  canMoveToColumn,
} from "./boardDragDrop";

import { cards, columns } from "@/test/fixtures";

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

describe("findCardById", () => {
  it.each([
    [2, cards[1]],
    [999, undefined],
  ])("returns the expected result for card id %i", (id, expected) => {
    expect(findCardById(cards, id)).toEqual(expected);
  });
});

describe("findColumnById", () => {
  it.each([
    [20, columns[1]],
    [999, undefined],
  ])("returns the expected result for column id %i", (id, expected) => {
    expect(findColumnById(columns, id)).toEqual(expected);
  });
});

describe("getActiveCardId", () => {
  it.each([
    [CARD_ID, 123],
    [COLUMN_ID, null],
  ])("returns the expected result for active id %s", (id, expected) => {
    const active = {
      id,
    } as Parameters<typeof getActiveCardId>[0];

    expect(getActiveCardId(active)).toBe(expected);
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

describe("getDestinationCards", () => {
  const unsortedCards = [
    { id: 1, columnId: 10, order: 3 },
    { id: 2, columnId: 10, order: 1 },
    { id: 3, columnId: 10, order: 2 },
  ] as typeof cards;

  const sortedCards = [unsortedCards[1], unsortedCards[2], unsortedCards[0]];

  it.each([
    [
      "returns cards from the destination column excluding the active card",
      cards,
      10,
      1,
      [cards[1]],
    ],
    ["sorts destination cards by order", unsortedCards, 10, 999, sortedCards],
    [
      "does not include cards from other columns",
      cards,
      10,
      999,
      [cards[0], cards[1]],
    ],
  ])("%s", (_description, cardList, columnId, activeCardId, expected) => {
    expect(getDestinationCards(cardList, columnId, activeCardId)).toEqual(
      expected,
    );
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
