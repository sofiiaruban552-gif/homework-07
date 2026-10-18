import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checklist from './Checklist';
import { checklistItems } from '@/test/fixtures';

const onToggleItem = vi.fn();
const onAddItem = vi.fn();

const ITEM_LABELS = ['First item', 'Second item', 'Third item'];
const CHECKBOX_STATES = [
  { index: 0, checked: true },
  { index: 1, checked: false },
  { index: 2, checked: false },
];
const NEW_ITEM = 'New item';
const ADD_ITEM_PLACEHOLDER = 'Add item...';
const ADD_BUTTON_NAME = '+ Add';

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

const getAddInput = () =>
  screen.getByPlaceholderText(ADD_ITEM_PLACEHOLDER);

const getAddButton = () =>
  screen.getByRole('button', { name: ADD_BUTTON_NAME });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Checklist', () => {
  it.each(ITEM_LABELS)('renders the item "%s"', (label) => {
    renderChecklist();

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it.each(CHECKBOX_STATES)(
    'renders checkbox $index as checked=$checked',
    ({ index, checked }) => {
      renderChecklist();

      const checkboxes = screen.getAllByRole('checkbox');

      if (checked) {
        expect(checkboxes[index]).toBeChecked();
      } else {
        expect(checkboxes[index]).not.toBeChecked();
      }
    },
  );

  it('shows add controls when onAddItem is provided', () => {
    renderChecklist();

    expect(getAddInput()).toBeInTheDocument();
    expect(getAddButton()).toBeInTheDocument();
  });

  it('hides add controls when onAddItem is omitted', () => {
    renderChecklist({ onAddItem: undefined });

    expect(
      screen.queryByPlaceholderText(ADD_ITEM_PLACEHOLDER),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: ADD_BUTTON_NAME }),
    ).not.toBeInTheDocument();
  });

  it('calls onAddItem with the entered text', async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.type(getAddInput(), NEW_ITEM);
    await user.click(getAddButton());

    expect(onAddItem).toHaveBeenCalledWith(NEW_ITEM);
  });

  it('calls onAddItem when Enter is pressed', async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.type(getAddInput(), `${NEW_ITEM}{Enter}`);

    expect(onAddItem).toHaveBeenCalledWith(NEW_ITEM);
  });

  it('does not add an empty item', async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.click(getAddButton());

    expect(onAddItem).not.toHaveBeenCalled();
  });
});
