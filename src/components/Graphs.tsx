import { useEffect, useState } from 'react';
import {
  getAvailableCurrencies,
  getLatestOfficialRate,
  getParallelRateAverage,
} from '../services/exchangeService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExchangeComparison = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const currencies = await getAvailableCurrencies();
        const results = await Promise.all(
          currencies.map(async (currency: string) => {
            const [official, parallel] = await Promise.all([
              getLatestOfficialRate(currency),
              getParallelRateAverage(currency),
            ]);

            return {
              currency,
              officialBuy: official?.buy ?? '-',
              officialSell: official?.sell ?? '-',
              parallelBuy: parallel?.buy ?? '-',
              parallelSell: parallel?.sell ?? '-',
            };
          })
        );

        const chartLabels = results.map((row) => row.currency);
        const officialBuyData = results.map((row) => (row.officialBuy !== '-' ? row.officialBuy : null));
        const officialSellData = results.map((row) => (row.officialSell !== '-' ? row.officialSell : null));
        const parallelBuyData = results.map((row) => (row.parallelBuy !== '-' ? row.parallelBuy : null));
        const parallelSellData = results.map((row) => (row.parallelSell !== '-' ? row.parallelSell : null));

        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: 'Oficial Compra',
              data: officialBuyData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Oficial Venta',
              data: officialSellData,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Paralelo Compra',
              data: parallelBuyData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Paralelo Venta',
              data: parallelSellData,
              backgroundColor: 'rgba(255, 206, 86, 0.6)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
          ],
        });

        setRows(results);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h6" align="center" gutterBottom sx={{ mt: 2 }}>
        Comparación de Tipo de Cambio Oficial vs Paralelo
      </Typography>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Moneda</TableCell>
              <TableCell align="center">Oficial Compra</TableCell>
              <TableCell align="center">Oficial Venta</TableCell>
              <TableCell align="center">Paralelo Compra</TableCell>
              <TableCell align="center">Paralelo Venta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              console.log(row);
              return (
              <TableRow key={row.currency}>
                <TableCell>{row.currency}</TableCell>
                <TableCell align="center">{Number(row.officialBuy)}</TableCell>
                <TableCell align="center">{Number(row.officialSell)}</TableCell>
                <TableCell align="center">{Number(row.parallelBuy)}</TableCell>
                <TableCell align="center">{Number(row.parallelSell)}</TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Gráfico */}
      {chartData && (
        <div style={{ marginTop: '2rem', maxWidth: '800px', margin: 'auto' }}>
          <Typography variant="h6" align="center" gutterBottom>
            Gráfico de Comparación
          </Typography>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Tipos de Cambio Oficial vs Paralelo' },
              },
              scales: {
                y: {
                  beginAtZero: false,
                  title: { display: true, text: 'Tasa de Cambio' },
                },
                x: {
                  title: { display: true, text: 'Moneda' },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ExchangeComparison;