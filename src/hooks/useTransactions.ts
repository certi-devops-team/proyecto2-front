import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useUserContext, type User } from "../context/UserContext";
import type { ITransaction } from "../models/ITransaction";
import {
  createTransaction,
  getTransactionsByUser,
} from "../services/transactionsService";
import { getUsers, updateWallets } from "../services/userService";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([] as ITransaction[]);
  const [users, setUsers] = useState([] as User[]);
  const [dateRange, setDateRange] = useState<"day" | "week" | "month">("month");
  const [selectedExchange, setSelectedExchange] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  const { user, setUser } = useUserContext();

  const metrics = () => {
    return {
      totalVolume: transactions.reduce((acc, t) => acc + Number(t.amount), 0),

      dailyVolume: transactions
        .filter((t) => {
          const today = new Date();
          const txDate = new Date(t.time);
          return today.toDateString() === txDate.toDateString();
        })
        .reduce((acc, t) => acc + Number(t.amount), 0),

      profitLoss: transactions.reduce((acc, t) => {
        return t.type === "Venta" ? acc + Number(t.amount) : acc - Number(t.amount);
      }, 0),

      averageRate: transactions.length
        ? transactions.reduce((acc, t) => acc + t.rate, 0) / transactions.length
        : 0,
    };
  };

  const transactionSchema = Yup.object({
    amount: Yup.number()
      .typeError("Debe ser un número válido")
      .min(1, "La cantidad debe ser mayor a 0")
      .max(
        Number(user?.wallet) || 0,
        `La cantidad no puede exceder el saldo disponible (${
          Number(user?.wallet) || 0
        })`
      )
      .required("La cantidad es requerida"),
    type: Yup.string()
      .oneOf(["Compra", "Venta"], "El tipo debe ser 'Compra' o 'Venta'")
      .required("El tipo de transacción es requerido"),
    currency: Yup.string()
      .max(10, "La moneda no puede exceder 10 caracteres")
      .required("La moneda es requerida"),
    receiverId: Yup.string().required("El receptor es requerido"),
    rate: Yup.number()
      .typeError("Cotización inválida")
      .min(0.1, "La cotizacion debe ser mayor a 0")
      .max(10000000, "La cotizacion no debe sobrepasar 10000000")
      .required("Cotización requerida"),
    exchangeHouseId: Yup.string().required("Casa de cambio requerida"),
  });

  const formik = useFormik({
    initialValues: {
      amount: 0,
      type: "",
      currency: "",
      receiverId: "",
    },
    validationSchema: transactionSchema,
    onSubmit: async (values) => {
      try {
        console.log(values)
        await submitHandler(values as ITransaction);
        closeFormHandler();
      } catch (error) {
        console.error("Error en el envío del formulario:", error);
      }
    },
  });

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  useEffect(() => {
    getFilteredTransactions();
  }, [transactions, dateRange, selectedExchange]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      const filteredUsers = data.filter((userQ: User) => userQ.id !== user?.id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openFormHandler = () => {
    setOpenForm(true);
  };

  const closeFormHandler = () => {
    setOpenForm(false);
  };

  const fetchTransactions = async () => {
    const response = await getTransactionsByUser(user!.id);
    setTransactions(response);
  };

  const submitHandler = async (values: ITransaction) => {
    const transaction = {
      ...values,
      senderId: user!.id,
      time: new Date().toISOString(),
    };

    const transactionRes = await createTransaction(transaction);
    const userRes = await updateWallets(transactionRes);
    setUser(userRes);
    setTransactions((prev) => [...prev, transactionRes]);
    closeFormHandler();
    formik.resetForm();
  };

  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    if (selectedExchange !== "all") {
      filtered = filtered.filter((t) => t.exchangeHouseId === selectedExchange);
    }

    const now = new Date();
    filtered = filtered.filter((t) => {
      const txDate = new Date(t.time);
      switch (dateRange) {
        case "day":
          return txDate.toDateString() === now.toDateString();
        case "week":{
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return txDate >= weekAgo;
        }
        case "month": {
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return txDate >= monthAgo;
        }
        default:
          return true;
      }
    });

    const groupedData = filtered.reduce((acc, tx) => {
      const date = new Date(tx.time).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, total: 0, compras: 0, ventas: 0 };
      }
      acc[date].total += tx.amount;
      if (tx.type === "Compra") {
        acc[date].compras += tx.amount;
      } else {
        acc[date].ventas += tx.amount;
      }
      return acc;
    }, {} as Record<string, any>);

    setFilteredTransactions(Object.values(groupedData));
  };

  return {
    transactions,
    filteredTransactions,
    setDateRange,
    dateRange,
    openForm,
    openFormHandler,
    closeFormHandler,
    submitHandler,
    user,
    users,
    formik,
    metrics,
    selectedExchange,
    setSelectedExchange,
  };
};
