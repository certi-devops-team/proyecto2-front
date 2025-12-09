import jsonServerInstance from '../api/jsonInstance';
import { getParallelRateAverage } from './exchangeService';

export const updateUserAlertSettings = async (userId: string, threshold: number, enabled: boolean) => {
  const response = await jsonServerInstance.patch(`/users/${userId}`, {
    alertThreshold: threshold,
    alertEnabled: enabled,
  });
  return response.data;
};

export const getUserAlertSettings = async (userId: string) => {
  const response = await jsonServerInstance.get(`/users/${userId}`);
  return {
    alertThreshold: response.data.alertThreshold,
    alertEnabled: response.data.alertEnabled,
  };
};

export const checkAlert = async (userId: string, currency: string = 'USD') => {
  const { alertThreshold, alertEnabled } = await getUserAlertSettings(userId);

  if (!alertEnabled) {
    return {
      triggered: false,
      message: 'La alerta está desactivada.',
      threshold: alertThreshold,
      enabled: alertEnabled,
    };
  }

  const parallelRate = await getParallelRateAverage(currency);

  if (!parallelRate) {
    return {
      triggered: false,
      message: 'No hay datos de tipo de cambio paralelo.',
      threshold: alertThreshold,
      enabled: alertEnabled,
    };
  }

  const isTriggered = parallelRate.buy > alertThreshold || parallelRate.sell > alertThreshold;
  return {
    triggered: isTriggered,
    message: isTriggered
      ? `¡Alerta! El tipo de cambio paralelo para ${currency} (Compra: ${parallelRate.buy}, Venta: ${parallelRate.sell}) superó el umbral de ${alertThreshold}.`
      : `El tipo de cambio paralelo para ${currency} está por debajo del umbral de ${alertThreshold}.`,
    buy: parallelRate.buy,
    sell: parallelRate.sell,
    threshold: alertThreshold,
    enabled: alertEnabled,
  };
};

export const simulateAlertCheck = async (userId: string, currency: string = 'USD') => {
  const { alertThreshold, alertEnabled } = await getUserAlertSettings(userId);

  if (!alertEnabled) {
    return {
      triggered: false,
      message: 'La alerta está desactivada.',
      threshold: alertThreshold,
      enabled: alertEnabled,
    };
  }

  const simulatedParallelRate = {
    currency,
    buy: 7.5, 
    sell: 7.6,
  };

  const isTriggered = simulatedParallelRate.buy > alertThreshold || simulatedParallelRate.sell > alertThreshold;
  return {
    triggered: isTriggered,
    message: isTriggered
      ? `¡Alerta simulada! El tipo de cambio paralelo para ${currency} (Compra: ${simulatedParallelRate.buy}, Venta: ${simulatedParallelRate.sell}) superó el umbral de ${alertThreshold}.`
      : `El tipo de cambio paralelo simulado para ${currency} está por debajo del umbral de ${alertThreshold}.`,
    buy: simulatedParallelRate.buy,
    sell: simulatedParallelRate.sell,
    threshold: alertThreshold,
    enabled: alertEnabled,
  };
};