import { api } from "@/lib/api";
import type { ApiUser } from "@/types";
import { create } from "zustand";

interface AdminState {
  users: ApiUser[];
  selectedUser: ApiUser | null;
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;

  fetchUsers: (page?: number, reset?: boolean) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  fetchUserById: (userId: string) => void;
  loadMoreUsers: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearSelectedUser: () => void;
  clearUsers: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  selectedUser: null,
  pagination: null,
  loading: false,
  loadingMore: false,
  error: null,
  searchQuery: "",

  fetchUsers: async (page = 0, reset = true) => {
    set({ loading: reset, loadingMore: !reset, error: null });

    try {
      const size = 10;
      const response = await api.getUsers(page, size, 'createdAt', 'DESC');

      // Extract data from ResponseBase structure
      const usersData = response.data.content;
      const paginationData = {
        page: response.data.page,
        size: response.data.size,
        total: response.data.total,
        totalPages: response.data.pages,
        hasNext: response.data.page < response.data.pages - 1,
        hasPrev: response.data.page > 0,
      };

      set((state) => ({
        users: reset ? usersData : [...state.users, ...usersData],
        pagination: paginationData,
        loading: false,
        loadingMore: false,
      }));
    } catch (error) {
      set({
        error: (error as Error).message,
        loading: false,
        loadingMore: false,
      });
    }
  },

  searchUsers: async (query: string) => {
    set({ searchQuery: query });
    // Para simplicidad, por ahora llamamos fetchUsers con página 0
    // En una implementación más completa, podríamos agregar búsqueda al endpoint
    await get().fetchUsers(0, true);
  },

  fetchUserById: (userId: string) => {
    // Solo busca en los datos ya cargados, no hace llamadas a la API
    const currentUsers = get().users;
    const foundUser = currentUsers.find((user) => user.idUser.toString() === userId);
    set({ selectedUser: foundUser || null });
  },

  loadMoreUsers: async () => {
    const state = get();
    if (state.pagination?.hasNext && !state.loadingMore) {
      await state.fetchUsers(state.pagination.page + 1, false);
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearSelectedUser: () => {
    set({ selectedUser: null });
  },

  clearUsers: () => {
    set({ users: [], pagination: null, searchQuery: "" });
  },
}));
