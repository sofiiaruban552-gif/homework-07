import type { DragStartEvent } from "@dnd-kit/core";
import {
  getCardId,
  getColumnId,
  isCardId,
  isColumnId,
  getDropIndex,
  canMoveToColumn,
  findCardById,
  findColumnById,
  getActiveCardId,
  getDestinationCards,
} from "./boardDragDrop";

import { makeCard, makeColumns } from "@/test/factories";

const CARD_ID = "card-123";
const COLUMN_ID = "column-123";
const OTHER_COLUMN_ID = "column-456";
const INVALID_ID = "invalid-id";

const FIRST_CARD_ID = 1;
const SECOND_CARD_ID = 2;
const THIRD_CARD_ID = 3;
const FOURTH_CARD_ID = 4;
const FIFTH_CARD_ID = 5;

const FIRST_COLUMN_ID = 10;
const SECOND_COLUMN_ID = 20;

const NON_EXISTING_ID = 999;

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
  const columns = makeColumns();

  it.each([
    ["allows moving within the same column", FIRST_COLUMN_ID, FIRST_COLUMN_ID, 100, true],
    [
      "returns false when the destination column does not exist",
      FIRST_COLUMN_ID,
      NON_EXISTING_ID,
      0,
      false,
    ],
    ["allows moving to a column without a limit", FIRST_COLUMN_ID, FIRST_COLUMN_ID, 0, true],
    [
      "allows moving when destination count is below the limit",
      FIRST_COLUMN_ID,
      SECOND_COLUMN_ID,
      2,
      true,
    ],
    [
      "prevents moving when destination count reaches the limit",
      FIRST_COLUMN_ID,
      SECOND_COLUMN_ID,
      3,
      false,
    ],
    [
      "prevents moving when destination count exceeds the limit",
      FIRST_COLUMN_ID,
      SECOND_COLUMN_ID,
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

describe("findCardById", () => {
  const cards = [
    makeCard({ id: FIRST_CARD_ID }),
    makeCard({ id: SECOND_CARD_ID }),
    makeCard({ id: THIRD_CARD_ID }),
  ];

  it("returns the card when it exists", () => {
    expect(findCardById(cards, SECOND_CARD_ID)).toBe(cards[1]);
  });

  it("returns undefined when the card does not exist", () => {
    expect(findCardById(cards, NON_EXISTING_ID)).toBeUndefined();
  });

  it("returns undefined when the cards array is empty", () => {
    expect(findCardById([], FIRST_CARD_ID)).toBeUndefined();
  });
});

describe("findColumnById", () => {
  const columns = makeColumns();

  it("returns the column when it exists", () => {
    expect(findColumnById(columns, SECOND_COLUMN_ID)).toBe(columns[1]);
  });

  it("returns undefined when the column does not exist", () => {
    expect(findColumnById(columns, NON_EXISTING_ID)).toBeUndefined();
  });

  it("returns undefined when the columns array is empty", () => {
    expect(findColumnById([], FIRST_COLUMN_ID)).toBeUndefined();
  });
});

describe("getActiveCardId", () => {
  it("returns the numeric card id when active id is a card", () => {
    const active = { id: CARD_ID } as DragStartEvent["active"];

    expect(getActiveCardId(active)).toBe(123);
  });

  it("returns null when active id is a column", () => {
    const active = { id: COLUMN_ID } as DragStartEvent["active"];

    expect(getActiveCardId(active)).toBeNull();
  });

  it("returns null when active id is invalid", () => {
    const active = { id: INVALID_ID } as DragStartEvent["active"];

    expect(getActiveCardId(active)).toBeNull();
  });
});

describe("getDestinationCards", () => {
  const cards = [
    makeCard({ id: FIRST_CARD_ID, columnId: FIRST_COLUMN_ID, order: 2 }),
    makeCard({ id: SECOND_CARD_ID, columnId: SECOND_COLUMN_ID, order: 3 }),
    makeCard({ id: THIRD_CARD_ID, columnId: SECOND_COLUMN_ID, order: 1 }),
    makeCard({ id: FOURTH_CARD_ID, columnId: SECOND_COLUMN_ID, order: 2 }),
    makeCard({ id: FIFTH_CARD_ID, columnId: FIRST_COLUMN_ID, order: 1 }),
  ];

  it("returns cards belonging to the destination column, excluding the specified card", () => {
    const result = getDestinationCards(
      cards,
      SECOND_COLUMN_ID,
      THIRD_CARD_ID,
    );

    expect(result).toEqual([cards[3], cards[1]]);
  });

  it("sorts destination cards by order in ascending order", () => {
    const result = getDestinationCards(
      cards,
      SECOND_COLUMN_ID,
      NON_EXISTING_ID,
    );

    expect(result.map((card) => card.order)).toEqual([1, 2, 3]);
  });

  it("returns an empty array when no cards belong to the destination column", () => {
    expect(
      getDestinationCards(cards, NON_EXISTING_ID, NON_EXISTING_ID),
    ).toEqual([]);
  });
});

