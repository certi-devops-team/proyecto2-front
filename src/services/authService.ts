// src/services/authService.ts
import jsonServerInstance from "../api/jsonInstance";
import type { User } from "../interface/userInterface";

export const login = async (email: string, password: string) => {
  const response = await jsonServerInstance.post("/auth/login", {
    email, password
  });
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  name: string,
  lastName: string,
  role: "admin" | "client" = "client"
) => {
  try {
    const newUser = {
      email,
      password,
      name,
      lastName,
      role, // Usa el parámetro
    };

    const response = await jsonServerInstance.post(`/auth/register`, newUser);
    return response.data;
  } catch (error) {
    console.error("Error en el registro:", error);
    return null;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  try {
    const response = await jsonServerInstance.patch(`/users/${userId}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};