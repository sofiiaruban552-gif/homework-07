import { create } from "zustand";

import { getUsers } from "@/api";
import type { User } from "@/types";

export interface AssigneeOption {
  value: string;
  label: string;
}

export const getAssigneeOptions = (
  users: User[],
): AssigneeOption[] => [
  {
    value: "",
    label: "Select assignee",
  },
  ...users.map((user) => ({
    value: String(user.id),
    label: user.name,
  })),
];

interface UsersStore {
  users: User[];
  loading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  getUserById: (id: number) => User | undefined;
}

const useUsersStore = create<UsersStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    const { users, loading } = get();

    if (users.length > 0 || loading) {
      return;
    }

    set({
      loading: true,
      error: null,
    });

    try {
      const users = await getUsers();

      set({
        users,
        loading: false,
      });
    } catch {
      set({
        loading: false,
        error: "Failed to load users",
      });
    }
  },

  getUserById: (id) => {
    return get().users.find((user) => user.id === id);
  },
}));

export default useUsersStore;

