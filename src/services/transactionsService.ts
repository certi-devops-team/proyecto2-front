import jsonInstance from "../api/jsonInstance";
import type { ITransaction } from "../models/ITransaction";

export const getTransactionsByUser = async (userId: string) => {
  try {
    const response = await jsonInstance.get(`/transactions`);
    const data = response.data.filter(
      (transaction: ITransaction) =>
        transaction.senderId === userId || transaction.receiverId === userId
    );
    return data;
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
