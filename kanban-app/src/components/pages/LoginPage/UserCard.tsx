import UserInfo from "@/components/shared/UserInfo";
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
    <UserInfo
      user={user}
      avatarClassName="user-card__avatar"
      nameClassName="user-card__name"
    />
  </label>
);

export default UserCard;
