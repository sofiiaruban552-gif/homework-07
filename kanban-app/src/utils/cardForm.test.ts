import type { CardForm } from "@/types";
import {
  getInitialCardForm,
  getCardFormPayload,
  getNextCardOrder,
} from "./cardForm";

import { checklistItems, cards, cardForm } from "@/test/fixtures/index";

describe("getInitialCardForm", () => {
  it("returns an empty form when userId is not provided", () => {
    expect(getInitialCardForm()).toEqual({
      title: "",
      description: "",
      assignee: "",
    });
  });

  it("sets the assignee from userId", () => {
    expect(getInitialCardForm(123)).toEqual({
      title: "",
      description: "",
      assignee: "123",
    });
  });
});

describe("getCardFormPayload", () => {
  it("trims title and description and converts assignee to a number", () => {
    const data: CardForm = {
      title: "  Test card  ",
      description: "  Test description  ",
      assignee: "123",
    };

    expect(getCardFormPayload(data, checklistItems)).toEqual({
      title: cardForm.title,
      description: cardForm.description,
      assigneeId: 123,
      checklist: checklistItems,
    });
  });

  it("sets assigneeId to null when no assignee is selected", () => {
    const data: CardForm = {
      ...cardForm
    };

    expect(getCardFormPayload(data, checklistItems)).toEqual({
      title: cardForm.title,
      description: cardForm.description,
      assigneeId: null,
      checklist: checklistItems,
    });
  });
});

describe("getNextCardOrder", () => {
  it("returns the next order for cards in the column", () => {
    expect(getNextCardOrder(cards, 10)).toBe(4);
  });

  it("ignores cards from other columns", () => {
    expect(getNextCardOrder(cards, 20)).toBe(6);
  });

  it("returns 1 when the column has no cards", () => {
    expect(getNextCardOrder(cards, 999)).toBe(1);
  });
});

