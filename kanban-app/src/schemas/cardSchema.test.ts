import { CARD_ERROR_MESSAGES, cardSchema } from "./cardSchema";

const validCardData = {
  title: "Test card",
  description: "Test description",
  assignee: "123",
};

describe("cardSchema", () => {
  it("accepts valid card data", () => {
    expect(cardSchema.safeParse(validCardData).success).toBe(true);
  });

  it("trims title and description", () => {
    const data = {
      ...validCardData,
      title: `  ${validCardData.title}  `,
      description: `  ${validCardData.description}  `,
    };

    expect(cardSchema.parse(data)).toEqual(validCardData);
  });

  it.each([
    [
      "rejects an empty title",
      { title: "" },
      CARD_ERROR_MESSAGES.TITLE_REQUIRED,
    ],
    [
      "rejects a whitespace-only title",
      { title: "   " },
      CARD_ERROR_MESSAGES.TITLE_REQUIRED,
    ],
    [
      "rejects an empty description",
      { description: "" },
      CARD_ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH,
    ],
    [
      "rejects a description shorter than 5 characters",
      { description: "Test" },
      CARD_ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH,
    ],
    [
      "rejects a whitespace-only description",
      { description: "     " },
      CARD_ERROR_MESSAGES.DESCRIPTION_MIN_LENGTH,
    ],
  ])("%s", (_description, overrides, expectedMessage) => {
    const result = cardSchema.safeParse({
      ...validCardData,
      ...overrides,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        expectedMessage,
      );
    }
  });

  it.each([
    ["accepts an empty assignee", ""],
    ["accepts a numeric string assignee", "123"],
    ["accepts a non-numeric string assignee", "abc"],
  ])("%s", (_description, assignee) => {
    const result = cardSchema.safeParse({
      ...validCardData,
      assignee,
    });

    expect(result.success).toBe(true);
  });

  it.each([
    ["rejects a missing title", { title: undefined }],
    ["rejects a missing description", { description: undefined }],
    ["rejects a missing assignee", { assignee: undefined }],
  ])("%s", (_description, overrides) => {
    const data = { ...validCardData, ...overrides };
    delete data.title;
    delete data.description;
    delete data.assignee;

    const result = cardSchema.safeParse({
      ...validCardData,
      ...overrides,
    });

    expect(result.success).toBe(false);
  });
});
