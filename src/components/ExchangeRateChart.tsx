import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { IExchangeRate } from "../models/IExchangeRate";

interface ExchangeRateChartProps {
  rates: IExchangeRate[];
  casaName: string;
}

const ExchangeRateChart: React.FC<ExchangeRateChartProps> = ({
  rates,
  casaName,
}) => {
  const minY = Math.min(...rates.map((rate) => Math.min(rate.buy, rate.sell))) - 0.1; // Margen inferior
  const maxY = Math.max(...rates.map((rate) => Math.max(rate.buy, rate.sell))) + 0.1; // Margen superior

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Historial de Cotizaciones - {casaName}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={rates}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[minY, maxY]} /> 
          <Tooltip />
          <Line type="monotone" dataKey="buy" stroke="#8884d8" name="Compra" />
          <Line type="monotone" dataKey="sell" stroke="#82ca9d" name="Venta" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ExchangeRateChart;