import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checklist from './Checklist';
import { checklistItems } from '@/test/fixtures';

const onToggleItem = vi.fn();
const onAddItem = vi.fn();

const renderChecklist = (
  props: Partial<React.ComponentProps<typeof Checklist>> = {},
) => {
  return render(
    <Checklist
      items={checklistItems}
      onToggleItem={onToggleItem}
      onAddItem={onAddItem}
      {...props}
    />,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Checklist', () => {
  it('renders all checklist items', () => {
    renderChecklist();

    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
    expect(screen.getByText('Third item')).toBeInTheDocument();
  });

  it('renders completed and incomplete items correctly', () => {
    renderChecklist();

    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('shows add controls when onAddItem is provided', () => {
    renderChecklist();

    expect(screen.getByPlaceholderText('Add item...')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '+ Add' }),
    ).toBeInTheDocument();
  });

  it('hides add controls when onAddItem is omitted', () => {
    renderChecklist({ onAddItem: undefined });

    expect(
      screen.queryByPlaceholderText('Add item...'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: '+ Add' }),
    ).not.toBeInTheDocument();
  });

  it('calls onAddItem with the entered text', async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.type(
      screen.getByPlaceholderText('Add item...'),
      'New item',
    );

    await user.click(
      screen.getByRole('button', { name: '+ Add' }),
    );

    expect(onAddItem).toHaveBeenCalledWith('New item');
  });

  it('calls onAddItem when Enter is pressed', async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.type(
      screen.getByPlaceholderText('Add item...'),
      'New item{Enter}',
    );

    expect(onAddItem).toHaveBeenCalledWith('New item');
  });

  it('does not add an empty item', async () => {
    const user = userEvent.setup();

    renderChecklist();

    await user.click(
      screen.getByRole('button', { name: '+ Add' }),
    );

    expect(onAddItem).not.toHaveBeenCalled();
  });
});

