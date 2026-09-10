import Avatar from "@/components/shared/Avatar";
import type { User } from "@/types";
import clsx from "clsx";

interface UserCardProps {
  user: User;
  checked: boolean;
  onChange: (value: number) => void;
}

const UserCard = ({ user, checked, onChange }: UserCardProps) => (
  <label
    htmlFor={`user-${user.id}`}
    className={clsx("user-card", {
      "user-card--selected": checked,
    })}
  >
    <input
      id={`user-${user.id}`}
      className="user-card__input"
      type="radio"
      name="user"
      checked={checked}
      onChange={() => onChange(user.id)}
    />
    <Avatar user={user} className="user-card__avatar" />
    <span className="user-card__name">{user.name}</span>
  </label>
);

export default UserCard;
