import { getCardFormPayload, getNextCardOrder } from "./cardForm";

import { makeCard, makeCardForm } from "@/test/factories";
import { checklistItems } from "@/test/fixtures";

describe("getCardFormPayload", () => {
  it.each([
    {
      description:
        "trims title and description and converts assignee to a number",
      data: makeCardForm({
        title: "  Test card  ",
        description: "  Test description  ",
        assignee: "123",
      }),
      expected: {
        title: "Test card",
        description: "Test description",
        assigneeId: 123,
        checklist: checklistItems,
      },
    },
    {
      description: "trims title and description and sets assigneeId to null",
      data: makeCardForm({
        title: "  Test card  ",
        description: "  Test description  ",
      }),
      expected: {
        title: "Test card",
        description: "Test description",
        assigneeId: null,
        checklist: checklistItems,
      },
    },
  ])("$description", ({ data, expected }) => {
    expect(getCardFormPayload(data, checklistItems)).toEqual(expected);
  });
});

describe("getNextCardOrder", () => {
  const cards = [
    makeCard({ id: 1, columnId: 10, order: 1 }),
    makeCard({ id: 2, columnId: 10, order: 3 }),
    makeCard({ id: 3, columnId: 20, order: 5 }),
  ];

  it.each([
    ["returns the next order for cards in the column", 10, 4],
    ["ignores cards from other columns", 20, 6],
    ["returns 1 when the column has no cards", 999, 1],
  ])("%s", (_description, columnId, expected) => {
    expect(getNextCardOrder(cards, columnId)).toBe(expected);
  });
});
