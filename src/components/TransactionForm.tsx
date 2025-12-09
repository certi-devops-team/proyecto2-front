import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useUserContext, type User } from "../context/UserContext";
import { useQuotesStore } from "../store/quotesStore";

interface TransactionFormProps {
  open: boolean;
  handleClose: () => void;
  formik: any;
  users: User[];
}
const TransactionForm = ({
  open,
  handleClose,
  formik,
  users,
}: TransactionFormProps) => {
  const { user } = useUserContext();
  const exchangeHouses = useQuotesStore((state) => state.quotes);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Realizar Transacción</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Typography sx={{ marginBottom: 2 }}>
            Saldo disponible: ${Number(user?.wallet).toFixed(2) || 0}
          </Typography>
          <TextField
            fullWidth
            name="amount"
            label="Cantidad"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
          />
          <InputLabel>Tipo</InputLabel>
          <Select
            fullWidth
            name="type"
            margin="dense"
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
          >
            <MenuItem value="Compra">Compra</MenuItem>
            <MenuItem value="Venta">Venta</MenuItem>
          </Select>
          {formik.touched.type && formik.errors.type && (
            <div style={{ color: "red", fontSize: "0.75rem" }}>
              {formik.errors.type}
            </div>
          )}
          <TextField
            fullWidth
            margin="dense"
            name="currency"
            label="Moneda"
            value={formik.values.currency}
            onChange={formik.handleChange}
            error={formik.touched.currency && Boolean(formik.errors.currency)}
            helperText={formik.touched.currency && formik.errors.currency}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Receptor</InputLabel>
            <Select
              name="receiverId"
              value={formik.values.receiverId}
              onChange={formik.handleChange}
              error={
                formik.touched.receiverId && Boolean(formik.errors.receiverId)
              }
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} {user.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Casa de Cambio</InputLabel>
            <Select
              name="exchangeHouseId"
              value={formik.values.exchangeHouseId}
              onChange={formik.handleChange}
              error={
                formik.touched.exchangeHouseId &&
                Boolean(formik.errors.exchangeHouseId)
              }
            >
              {exchangeHouses.map((house) => (
                <MenuItem key={house.name} value={house.name}>
                  {house.name} - Compra: {house.official.buy} / Venta:{" "}
                  {house.official.sell}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            name="rate"
            label="Cotización"
            type="number"
            value={formik.values.rate}
            onChange={formik.handleChange}
            error={formik.touched.rate && Boolean(formik.errors.rate)}
            helperText={formik.touched.rate && formik.errors.rate}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="info">
            Cancelar
          </Button>
          <Button variant="contained" type="submit" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionForm;
