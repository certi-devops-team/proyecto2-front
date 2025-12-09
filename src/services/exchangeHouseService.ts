// src/services/exchangeHouseService.ts
import jsonServerInstance from "../api/jsonInstance";
import type { IExchangeHouse } from "../models/IExchangeHouse";

export const getExchangeHouses = async () => {
  try {
    const response = await jsonServerInstance.get("/exchangeHouses");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las casas de cambio:", error);
    throw error;
  }
};

export const createExchangeHouse = async (houseData: IExchangeHouse) => {
  try {
    const response = await jsonServerInstance.post("/exchangeHouses", houseData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la casa de cambio:", error);
    throw error;
  }
};

export const updateExchangeHouse = async (houseData: IExchangeHouse, id?: string) => {
  try {
    if (!id) {
      console.error("ID de la casa de cambio es requerido para actualizar.");
    }
    const response = await jsonServerInstance.put(`/exchangeHouses/${id}`, houseData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la casa de cambio:", error);
    throw error;
  }
};

export const deleteExchangeHouse = async (id: string) => {
  try {
    const response = await jsonServerInstance.delete(`/exchangeHouses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la casa de cambio:", error);
    throw error;
  }
};