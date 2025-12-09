import jsonInstance from "../api/jsonInstance";
import type { User } from "../context/UserContext";
import type { ITransaction } from "../models/ITransaction";

export const getUsers = async () => {
  try {
    const response = await jsonInstance.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

export const updateWallets = async (transaction: ITransaction) => {
  try {
    const senderResponse = await jsonInstance.get(
      `/users/${transaction.senderId}`
    );
    const receiverResponse = await jsonInstance.get(
      `/users/${transaction.receiverId}`
    );

    const sender = senderResponse.data as User;
    const receiver = receiverResponse.data as User;

    // Actualizar los saldos
    sender.wallet -= Number(transaction.amount);
    receiver.wallet += Number(transaction.amount);

    const senderRes = await jsonInstance.put(`/users/${sender.id}`, sender);
    await jsonInstance.put(`/users/${receiver.id}`, receiver);
    return senderRes.data;
  } catch (error) {
    console.error("Error al actualizar los wallets:", error);
    throw error;
  }
};
