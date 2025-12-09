import { useEffect, useState } from "react";
import {
  getExchangeHouses,
  createExchangeHouse,
  updateExchangeHouse,
  deleteExchangeHouse,
} from "../services/exchangeHouseService";
import type { IExchangeHouse } from "../models/IExchangeHouse";
import { useQuotesStore } from "../store/quotesStore";

export const useExchangeManagement = () => {
  const [casas, setCasas] = useState<IExchangeHouse[]>([]);
  const setQuotes = useQuotesStore((state) => state.setQuotes);

  const fetchCasas = async () => {
    const response = await getExchangeHouses();
    setCasas(response);
    sincronizarConQuotes(response);
  };

  const sincronizarConQuotes = (casasData: IExchangeHouse[]) => {
    const newQuotes = casasData.map((casa) => ({
      name: casa.name,
      address: casa.address,
      currency: casa.currency,
      official: { buy: casa.buy, sell: casa.sell },
      parallel: { buy: casa.buy * 1.02, sell: casa.sell * 1.02 },
      volatile: false,
    }));
    setQuotes(newQuotes);
  };

  const crearCasa = async (values: IExchangeHouse) => {
    await createExchangeHouse(values);
    await fetchCasas();
  };

  const actualizarCasa = async (values: IExchangeHouse, id: string) => {
    await updateExchangeHouse(values, id);
    await fetchCasas();
  };

  const eliminarCasa = async (id: string) => {
    await deleteExchangeHouse(id);
    await fetchCasas();
  };

  useEffect(() => {
    fetchCasas();
  }, []);

  return {
    casas,
    fetchCasas,
    crearCasa,
    actualizarCasa,
    eliminarCasa,
  };
};
