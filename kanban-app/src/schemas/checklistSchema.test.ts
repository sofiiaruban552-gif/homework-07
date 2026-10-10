import {
  CHECKLIST_ITEM_ERROR_MESSAGES,
  checklistItemSchema,
} from "./checklistSchema";

const validChecklistItem = {
  text: "Buy groceries",
};

describe("checklistItemSchema", () => {
  it("accepts valid checklist item data", () => {
    expect(checklistItemSchema.safeParse(validChecklistItem).success).toBe(
      true,
    );
  });

  it("trims whitespace from text", () => {
    const result = checklistItemSchema.parse({
      text: `  ${validChecklistItem.text}  `,
    });

    expect(result).toEqual(validChecklistItem);
  });

  it.each([
    ["an empty string", ""],
    ["a whitespace-only string", "   "],
  ])("rejects %s", (_description, text) => {
    const result = checklistItemSchema.safeParse({ text });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        CHECKLIST_ITEM_ERROR_MESSAGES.TEXT_REQUIRED,
      );
    }
  });

  it.each([
    ["a missing text field", {}],
    ["an undefined text field", { text: undefined }],
    ["a null text field", { text: null }],
    ["a numeric text field", { text: 123 }],
  ])("rejects %s", (_description, data) => {
    expect(checklistItemSchema.safeParse(data).success).toBe(false);
  });
});

