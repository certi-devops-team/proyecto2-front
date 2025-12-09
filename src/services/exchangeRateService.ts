import jsonServerInstance from "../api/jsonInstance";

export const getOfficialExchangeRates = async () => {
    const response = await jsonServerInstance.get('/officialExchangeRate');
    return response.data;
};

export const getExchangeRateHistory = async (
    exchangeHouseId: string
) => {
    const response = await jsonServerInstance.get(`/history?exchangeHouseId=${exchangeHouseId}`)
    return response.data;
};