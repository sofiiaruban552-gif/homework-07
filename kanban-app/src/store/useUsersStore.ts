import { create } from "zustand";
import { getUsers } from "@/api";
import type { User } from "@/types";

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
    if (get().users.length > 0) {
      return;
    }

    if (get().loading) {
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
