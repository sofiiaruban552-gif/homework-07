import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Surface from "@/components/shared/Surface";
import UserCard from "./UserCard";
import useAuthStore from "@/store/useAuthStore";
import useUsersStore from "@/store/useUsersStore";
import { ROUTES } from "@/types/routes";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { users, loading, fetchUsers } = useUsersStore();

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length, fetchUsers]);

  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleSelectUser = (id: number) => {
    setSelectedUser(id);

    const user = users.find((user) => user.id === id);

    if (user) {
      login(user);
      navigate(ROUTES.BOARD);
    }
  };
  
  if (loading) {
    return (
        <p>Loading board...</p>
    );
  }

  return (
    <Surface>
      <h1>Who are you?</h1>
      <p>Select a user to continue</p>

      <div className="user-selector__grid">
        {users.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            name={user.name}
            color={user.color}
            checked={selectedUser === user.id}
            onChange={handleSelectUser}
          />
        ))}
      </div>
    </Surface>
  );
};

export default LoginPage;
