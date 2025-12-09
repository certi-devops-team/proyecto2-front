import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { IExchangeHouse } from "../models/IExchangeHouse";
import ExchangeMap from "./ExchangeMap";

interface ExchangeHouseTableProps {
  casas: IExchangeHouse[];
  onEdit: (casa: IExchangeHouse) => void;
  onDelete: (id: string) => void;
}

const ExchangeHouseTable: React.FC<ExchangeHouseTableProps> = ({
  casas,
  onEdit,
  onDelete,
}) => {
  const [openRow, setOpenRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setOpenRow(openRow === id ? null : id);
  };

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Nombre</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell align="right">Moneda</TableCell>
            <TableCell align="right">Compra</TableCell>
            <TableCell align="right">Venta</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {casas.map((casa) => (
            <>
              <TableRow>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => toggleRow(casa.id!)}
                  >
                    {openRow === casa.id ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {casa.name}
                </TableCell>
                <TableCell>{casa.address}</TableCell>
                <TableCell align="right">{casa.currency}</TableCell>
                <TableCell align="right">{casa.buy}</TableCell>
                <TableCell align="right">{casa.sell}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar casa de cambio">
                    <IconButton color="primary" onClick={() => onEdit(casa)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar casa de cambio">
                    <IconButton
                      color="error"
                      onClick={() => onDelete(casa.id!)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                  <Collapse in={openRow === casa.id} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                      <Typography variant="h6" gutterBottom component="div">
                        Ubicación en el mapa
                      </Typography>
                      <div style={{ height: "300px", width: "100%" }}>
                        <ExchangeMap
                          selectedHouse={casa}
                        />
                      </div>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExchangeHouseTable;
