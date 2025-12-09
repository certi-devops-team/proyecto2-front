import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import type { ITransaction } from "../models/ITransaction";
import { useTransactions } from "../hooks/useTransactions";
import { useQuotesStore } from "../store/quotesStore";

interface TransactionsTableProps {
  transactions: ITransaction[];
}
const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const { user, users } = useTransactions();
  const exchangeHouses = useQuotesStore((state) => state.quotes);
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Historial de Transacciones
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Monto</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Moneda</TableCell>
            <TableCell>Hora</TableCell>
            <TableCell>Casa de Cambio | Cotizacion</TableCell>
            <TableCell>Descripción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions ? (
            transactions.map((transaction: ITransaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{Number(transaction.amount.toFixed(2))} USD</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.currency}</TableCell>
                <TableCell>
                  {new Date(transaction.time).toLocaleString("es-BO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell>
                  {Number(transaction.rate.toFixed(2))} BOB
                  <Typography display="block" color="text.secondary">
                    {
                      exchangeHouses.find(
                        (h) => h.name === transaction.exchangeHouseId
                      )?.name
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  {transaction.senderId === user!.id
                    ? `Enviado a ${
                        users.find((user) => user.id === transaction.receiverId)
                          ?.name
                      }`
                    : `Recibido de ${
                        users.find((user) => user.id === transaction.senderId)
                          ?.name
                      }`}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>
                No hay transacciones disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};
export default TransactionsTable;
