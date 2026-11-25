import { makeCard } from "@/test/factories";
import { buildDuplicate, highlightCopySuffix } from "./duplicateCard";

describe("buildDuplicate", () => {
  it("adds the copy suffix to the title", () => {
    const card = makeCard({ title: "Write docs" });

    expect(buildDuplicate(card).title).toBe("Write docs (copy)");
  });

  it("puts the copy right after the original", () => {
    const card = makeCard({ order: 2 });

    expect(buildDuplicate(card).order).toBe(3);
  });

  it("keeps the column and the assignee", () => {
    const card = makeCard({ columnId: 2, assigneeId: 1 });

    expect(buildDuplicate(card)).toMatchObject({ columnId: 2, assigneeId: 1 });
  });

  it("resets checklist progress for the copy", () => {
    const card = makeCard({
      checklist: [
        { id: 1, text: "Draft", done: true },
        { id: 2, text: "Review", done: false },
      ],
    });

    const copy = buildDuplicate(card);

    expect(copy.checklist.every((item) => !item.done)).toBe(true);
  });
});

describe("highlightCopySuffix", () => {
  it("wraps the copy suffix", () => {
    expect(highlightCopySuffix("Write docs (copy)")).toBe(
      'Write docs<em class="card__copy-label"> (copy)</em>',
    );
  });

  it("returns other titles as is", () => {
    expect(highlightCopySuffix("Write docs")).toBe("Write docs");
  });
});
