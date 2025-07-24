import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "@/types";
import { api } from "@/lib/api";
import { UserRole } from "@/types";

const mockUsers: User[] = [
  {
    id: "admin-001",
    name: "Administrador Principal",
    email: "admin@admin.com",
    role: UserRole.ADMIN,
    password: "admin123",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "user-001",
    name: "Juan Pérez",
    email: "juan@example.com",
    role: UserRole.USER,
    password: "user123",
    createdAt: "2024-02-01T14:30:00Z",
    updatedAt: "2024-02-01T14:30:00Z",
  },
  {
    id: "user-002",
    name: "María García",
    email: "maria@example.com",
    role: UserRole.USER,
    password: "user123",
    createdAt: "2024-02-10T09:15:00Z",
    updatedAt: "2024-02-10T09:15:00Z",
  },
  {
    id: "admin-002",
    name: "Ana Rodríguez",
    email: "ana@admin.com",
    role: UserRole.ADMIN,
    password: "admin123",
    createdAt: "2024-01-20T16:45:00Z",
    updatedAt: "2024-01-20T16:45:00Z",
  },
  {
    id: "user-003",
    name: "Carlos López",
    email: "carlos@example.com",
    role: UserRole.USER,
    password: "user123",
    createdAt: "2024-02-15T11:20:00Z",
    updatedAt: "2024-02-15T11:20:00Z",
  },
  {
    id: "user-004",
    name: "Laura Martínez",
    email: "laura@example.com",
    role: UserRole.USER,
    password: "user123",
    createdAt: "2024-02-20T13:10:00Z",
    updatedAt: "2024-02-20T13:10:00Z",
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null as User | null,
      token: null as string | null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isAuthenticated: false, user: null, token: null });

        const foundUser = mockUsers.find(
          (user) => user.email === email && user.password === password
        );

        if (foundUser) {
          const userWithoutPassword = { ...foundUser };
          delete userWithoutPassword.password;

          const token = `mock-token-${foundUser.id}`;

          set({
            user: userWithoutPassword,
            token: token,
            isAuthenticated: true,
          });

          localStorage.setItem("user", JSON.stringify(userWithoutPassword));
          localStorage.setItem("token", token);

          localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
          return;
        }

        try {
          const response = await api.login(email, password);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          });
          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("token", response.token);
        } catch (error) {
          throw new Error("Credenciales inválidas");
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("mockUsers");
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
          try {
            const parsedUser = JSON.parse(user);
            set({
              token,
              user: parsedUser,
              isAuthenticated: true,
            });
          } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            set({ user: null, token: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const getMockUsers = (): User[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("mockUsers");
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return mockUsers;
};
