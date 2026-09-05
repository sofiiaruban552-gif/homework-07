import clsx from "clsx";

interface UserCardProps {
  id: number;
  name: string;
  color: string;
  checked: boolean;
  onChange: (value: number) => void;
}

const UserCard = ({ id, name, color, checked, onChange }: UserCardProps) => (
  <label
    htmlFor={`user-${id}`}
    className={clsx("user-card", {
      "user-card--selected": checked,
    })}
  >
    <input
      id={`user-${id}`}
      className="user-card__input"
      type="radio"
      name="user"
      checked={checked}
      onChange={() => onChange(id)}
    />

    <div className="user-card__avatar" style={{ backgroundColor: color }}>
      {name[0]}
    </div>

    <span className="user-card__name">{name}</span>
  </label>
);

export default UserCard;
