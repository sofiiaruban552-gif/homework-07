import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserCard from './UserCard';
import { mockUsers } from '@/test/fixtures';


const mockUser = mockUsers[0];

const onChange = vi.fn();

const renderUserCard = (
  props: Partial<React.ComponentProps<typeof UserCard>> = {},
) =>
  render(
    <UserCard
      user={mockUser}
      checked={false}
      onChange={onChange}
      {...props}
    />,
  );

beforeEach(() => {
  vi.clearAllMocks();
});

describe('UserCard', () => {
  it('renders the user name', () => {
    renderUserCard();

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });

  it.each([
    { checked: true },
    { checked: false },
  ])('renders the correct selected state when checked=$checked', ({ checked }) => {
    renderUserCard({ checked });

    const label = screen.getByText(mockUser.name).closest('label');

    expect(label).toHaveClass('user-card');

    if (checked) {
      expect(label).toHaveClass('user-card--selected');
    } else {
      expect(label).not.toHaveClass('user-card--selected');
    }
  });

  it('renders a radio input with the correct attributes', () => {
    renderUserCard();

    const radio = screen.getByRole('radio');

    expect(radio).toHaveAttribute('id', `user-${mockUser.id}`);
    expect(radio).toHaveAttribute('name', 'user');
    expect(radio).toHaveClass('user-card__input');
    expect(radio).not.toBeChecked();
  });

  it.each([
    { checked: true },
    { checked: false },
  ])('reflects the checked prop: $checked', ({ checked }) => {
    renderUserCard({ checked });

    expect(screen.getByRole('radio')).toHaveProperty('checked', checked);
  });

  it('calls onChange with the user ID when selected', async () => {
    const user = userEvent.setup();

    renderUserCard();

    await user.click(screen.getByRole('radio'));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(mockUser.id);
  });
});
