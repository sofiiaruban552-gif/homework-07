import { useState } from "react";
import Surface from "@/components/shared/Surface";
import clsx from "clsx";

const users = [
  { id: "sofiia", name: "Sofiia", color: "var(--avatar-purple)" },
  { id: "marta", name: "Marta", color: "var(--avatar-green)" },
  { id: "andrii", name: "Andrii", color: "var(--avatar-orange)" },
  { id: "olena", name: "Olena", color: "var(--avatar-blue)" },
];

const LoginPage = () => {
  const [selectedUser, setSelectedUser] = useState(users[0].id);

  return (
    <Surface>
      <h1>Who are you?</h1>
      <p>Select a user to continue</p>
      <div className="user-selector__grid">
        {users.map((user) => (
          <label
            key={user.id}
            htmlFor={user.id}
            className={clsx("user-card", {
              "user-card--selected": selectedUser === user.id,
            })}
          >
            <input
              id={user.id}
              className="user-card__input"
              type="radio"
              name="user"
              value={user.id}
              checked={selectedUser === user.id}
              onChange={(e) => setSelectedUser(e.target.value)}
            />

            <div
              className="user-card__avatar"
              style={{ backgroundColor: user.color }}
            >
              {user.name[0]}
            </div>

            <span className="user-card__name">{user.name}</span>
          </label>
        ))}
      </div>
    </Surface>
  );
};

export default LoginPage;
