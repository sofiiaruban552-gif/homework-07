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
  it("returns true for a card id", () => {
    expect(isCardId(CARD_ID)).toBe(true);
  });

  it("returns false for a column id", () => {
    expect(isCardId(COLUMN_ID)).toBe(false);
  });
});

describe("isColumnId", () => {
  it("returns true for a column id", () => {
    expect(isColumnId(COLUMN_ID)).toBe(true);
  });

  it("returns false for a card id", () => {
    expect(isColumnId(CARD_ID)).toBe(false);
  });
});

describe("findCardById", () => {
  it("returns the card with the matching id", () => {
    expect(findCardById(cards, 2)).toEqual(cards[1]);
  });

  it("returns undefined when the card does not exist", () => {
    expect(findCardById(cards, 999)).toBeUndefined();
  });
});

describe("findColumnById", () => {
  it("returns the column with the matching id", () => {
    expect(findColumnById(columns, 20)).toEqual(columns[1]);
  });

  it("returns undefined when the column does not exist", () => {
    expect(findColumnById(columns, 999)).toBeUndefined();
  });
});

describe("getActiveCardId", () => {
  it("returns the card id when the active item is a card", () => {
    const active = {
      id: CARD_ID,
    } as Parameters<typeof getActiveCardId>[0];

    expect(getActiveCardId(active)).toBe(123);
  });

  it("returns null when the active item is not a card", () => {
    const active = {
      id: COLUMN_ID,
    } as Parameters<typeof getActiveCardId>[0];

    expect(getActiveCardId(active)).toBeNull();
  });
});

describe("getDropIndex", () => {
  const targetIndex = 2;

  const targetRect = {
    top: 100,
    height: 50,
  };

  it("returns the target index when there is no active rect", () => {
    expect(
      getDropIndex({
        targetIndex,
        activeRect: null,
        targetRect,
      }),
    ).toBe(targetIndex);
  });

  it("returns the target index when the active center is above the target center", () => {
    const activeRect = {
      top: 50,
      height: 40,
    };

    expect(
      getDropIndex({
        targetIndex,
        activeRect,
        targetRect,
      }),
    ).toBe(targetIndex);
  });

  it("returns the next index when the active center is below the target center", () => {
    const activeRect = {
      top: 150,
      height: 40,
    };

    expect(
      getDropIndex({
        targetIndex,
        activeRect,
        targetRect,
      }),
    ).toBe(targetIndex + 1);
  });
});

describe("getDestinationCards", () => {
  it("returns cards from the destination column excluding the active card", () => {
    expect(getDestinationCards(cards, 10, 1)).toEqual([
      cards[1],
    ]);
  });

  it("sorts destination cards by order", () => {
    const unsortedCards = [
      { id: 1, columnId: 10, order: 3 },
      { id: 2, columnId: 10, order: 1 },
      { id: 3, columnId: 10, order: 2 },
    ] as typeof cards;

    expect(getDestinationCards(unsortedCards, 10, 999)).toEqual([
      unsortedCards[1],
      unsortedCards[2],
      unsortedCards[0],
    ]);
  });

  it("does not include cards from other columns", () => {
    expect(getDestinationCards(cards, 10, 999)).toEqual([
      cards[0],
      cards[1],
    ]);
  });
});

describe("canMoveToColumn", () => {
  it("allows moving within the same column", () => {
    expect(canMoveToColumn(columns, 10, 10, 100)).toBe(true);
  });

  it("returns false when the destination column does not exist", () => {
    expect(canMoveToColumn(columns, 10, 999, 0)).toBe(false);
  });

  it("allows moving to a column without a limit", () => {
    expect(canMoveToColumn(columns, 10, 20, 0)).toBe(true);
  });

  it("allows moving when destination count is below the limit", () => {
    expect(canMoveToColumn(columns, 10, 20, 2)).toBe(true);
  });

  it("prevents moving when destination count reaches the limit", () => {
    expect(canMoveToColumn(columns, 10, 20, 3)).toBe(false);
  });

  it("prevents moving when destination count exceeds the limit", () => {
    expect(canMoveToColumn(columns, 10, 20, 4)).toBe(false);
  });
});

