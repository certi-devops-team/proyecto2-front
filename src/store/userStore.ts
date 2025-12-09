// src/store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getItem, setItem, removeItem } from "../helpers/localStorage";

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  token: string;
  alertThreshold: number;
  alertEnabled: boolean;
  role: "admin" | "cliente" | "user" | string;
  currencyPreference?: string;
  expiresAt?: number;
}

export interface LightUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserState {
  user: User | null; // Estado completo persistido
  lightUser: LightUser | null; // Estado ligero temporal
  setUser: (user: User | null) => void;
  setLightUser: (user: LightUser | null) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAdmin: () => boolean;
  hasRole: (role: string) => boolean;
  syncLightUser: () => void; // Sincroniza el usuario ligero con el completo
}


export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: getItem("user") || null,
      lightUser: null,

      setUser: (user: User | null) => {
        if (user) {
          if (!user.id || !user.email || !user.token) {
            console.warn("Datos de usuario incompletos, no se guardará.");
            return;
          }
          setItem("user", user);
          setItem("token", user.token);
          // Sincroniza el usuario ligero y muestra en consola
          get().syncLightUser();
        } else {
          removeItem("user");
          removeItem("token");
          set({ lightUser: null });
        }
        set({ user });
      },

      setLightUser: (user: LightUser | null) => {
        if (user) {
          console.log("LightUser actualizado:", {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          });
        } else {
          console.log("LightUser eliminado");
        }
        set({ lightUser: user });
      },

      logout: () => {
        removeItem("user");
        removeItem("token");
        set({ user: null, lightUser: null });
        console.log("Usuario deslogueado, lightUser limpiado");
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          setItem("user", updatedUser);
          set({ user: updatedUser });
          // Sincroniza el usuario ligero y muestra en consola
          get().syncLightUser();
        }
      },

      isAdmin: () => get().user?.role === "admin" || false,
      hasRole: (role: string) => get().user?.role === role || false,

      syncLightUser: () => {
        const fullUser = get().user;
        if (fullUser) {
          const lightUser: LightUser = {
            id: fullUser.id,
            name: fullUser.name,
            email: fullUser.email,
            role: fullUser.role,
          };
          set({ lightUser });
          console.log("LightUser sincronizado:", {
            id: lightUser.id,
            name: lightUser.name,
            email: lightUser.email,
            role: lightUser.role,
          });
        } else {
          set({ lightUser: null });
          console.log("No hay usuario completo, lightUser limpiado");
        }
      },
    }),
    {
      name: "user-storage",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({ user: state.user ?? null }) as any, // Solo persiste 'user'
    }
  )
);