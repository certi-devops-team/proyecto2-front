import { useState, useEffect } from "react";
import { Box, Typography, Alert, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getExchangeHouses } from "../services/exchangeHouseService";
import { getExchangeRateHistory } from "../services/exchangeRateService";
import type { IExchangeHouse } from "../models/IExchangeHouse";
import type { IExchangeRate } from "../models/IExchangeRate";
import ExchangeRateChart from "../components/ExchangeRateChart";

export default function HistorialPage() {
  const [casas, setCasas] = useState<IExchangeHouse[]>([]);
  const [selectedCasa, setSelectedCasa] = useState<IExchangeHouse | null>(null);
  const [rates, setRates] = useState<IExchangeRate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCasas = async () => {
    const response = await getExchangeHouses();
    setCasas(response);
  };

  const fetchRates = async () => {
    if (selectedCasa) {
      setLoading(true);
      const response = await getExchangeRateHistory(selectedCasa.id!);
      setRates(response);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasas();
  }, []);

  useEffect(() => {
    fetchRates();
  }, [selectedCasa]);

  const handleCasaChange = (event: any) => {
    const selectedId = event.target.value as string;
    const selectedCasa = casas.find((casa) => casa.id === selectedId);
    setSelectedCasa(selectedCasa || null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Historial de Cotizaciones
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <FormControl fullWidth>
          <InputLabel >Casa de Cambio</InputLabel>
          <Select
            onChange={handleCasaChange}
            defaultValue=""
          >
            {casas.map((casa) => (
              <MenuItem key={casa.id} value={casa.id}>
                {casa.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {selectedCasa && (
        <>
          {loading ? (
            <Typography variant="body1">Cargando datos...</Typography>
          ) : rates.length > 0 ? (
            <ExchangeRateChart rates={rates} casaName={selectedCasa.name} />
          ) : (
            <Alert severity="info" sx={{ marginTop: 2 }}>
              No hay datos de cotizaciones disponibles para esta casa de cambio.
            </Alert>
          )}
        </>
      )}
    </Box>
  );
}