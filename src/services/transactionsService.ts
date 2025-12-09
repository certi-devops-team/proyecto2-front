import jsonInstance from "../api/jsonInstance";
import type { ITransaction } from "../models/ITransaction";

export const getTransactionsByUser = async (userId: string) => {
  try {
    const response = await jsonInstance.get(`/transactions`, {
      params: {
        senderId: userId,
        receiverId: userId
      }
    });
    // El backend ya filtra, pero si devuelve todo, el filtro en cliente no hace daño
    // Sin embargo, para ser coherente con el backend, deberíamos confiar en los params
    return response.data;
  } catch (error) {
    console.error("Error al obtener las transacciones por usuario:", error);
    throw error;
  }
};

export const createTransaction = async (transactionData: ITransaction) => {
  try {
    const response = await jsonInstance.post("/transactions", transactionData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la transacción:", error);
    throw error;
  }
};
