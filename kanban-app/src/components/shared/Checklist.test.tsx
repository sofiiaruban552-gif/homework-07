import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checklist from "./Checklist";
import { checklistItems } from "@/test/fixtures";

const ITEM_LABELS = ["First item", "Second item", "Third item"];
const CHECKBOX_STATES = [
  { index: 0, checked: true },
  { index: 1, checked: false },
  { index: 2, checked: false },
];
const NEW_ITEM = "New item";
const ADD_BUTTON_NAME = "+ Add";

const getAddInput = () => screen.getByRole("textbox", { name: /add item/i });

const getAddButton = () =>
  screen.getByRole("button", { name: ADD_BUTTON_NAME });

describe("Checklist", () => {
  const onToggleItem = vi.fn();
  const onAddItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderChecklist = (
    props: Partial<React.ComponentProps<typeof Checklist>> = {},
  ) =>
    render(
      <Checklist
        items={checklistItems}
        onToggleItem={onToggleItem}
        onAddItem={onAddItem}
        {...props}
      />,
    );

  it.each(ITEM_LABELS)('renders the item "%s"', (label) => {
    renderChecklist();

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it.each(CHECKBOX_STATES)(
    "renders checkbox $index as checked=$checked",
    ({ index, checked }) => {
      renderChecklist();

      const checkbox = screen.getAllByRole("checkbox")[index];

      if (checked) {
        expect(checkbox).toBeChecked();
      } else {
        expect(checkbox).not.toBeChecked();
      }
    },
  );

  it("calls onToggleItem when a checkbox is clicked", async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.click(screen.getAllByRole("checkbox")[0]);

    expect(onToggleItem).toHaveBeenCalledWith(checklistItems[0].id);
  });

  it("shows add controls when onAddItem is provided", () => {
    renderChecklist();

    expect(getAddInput()).toBeInTheDocument();
    expect(getAddButton()).toBeInTheDocument();
  });

  it("hides add controls when onAddItem is omitted", () => {
    renderChecklist({ onAddItem: undefined });

    expect(
      screen.queryByRole("textbox", { name: /add item/i }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: ADD_BUTTON_NAME }),
    ).not.toBeInTheDocument();
  });

  it("calls onAddItem with the entered text", async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.type(getAddInput(), NEW_ITEM);
    await user.click(getAddButton());

    expect(onAddItem).toHaveBeenCalledWith(NEW_ITEM);
  });

  it("calls onAddItem when Enter is pressed", async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.type(getAddInput(), `${NEW_ITEM}{Enter}`);

    expect(onAddItem).toHaveBeenCalledWith(NEW_ITEM);
  });

  it("clears the input after adding an item", async () => {
    const user = userEvent.setup();

    renderChecklist();

    const input = getAddInput();

    await user.type(input, NEW_ITEM);
    await user.click(getAddButton());

    expect(input).toHaveValue("");
  });

  it("does not add an empty item", async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.click(getAddButton());

    expect(onAddItem).not.toHaveBeenCalled();
  });

  it("does not add an item containing only whitespace", async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.type(getAddInput(), "   ");
    await user.click(getAddButton());

    expect(onAddItem).not.toHaveBeenCalled();
  });
});
