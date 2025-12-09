import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import {
  updateUserAlertSettings,
  checkAlert,
  getUserAlertSettings,
  simulateAlertCheck,
} from "../services/AlertsService";

import { useUserStore } from "../store/userStore";

const AlertSettings = () => {
  const user = useUserStore((state) => state.user);
  const CURRENT_USER_ID = user?.id || "1";

  const [alertStatus, setAlertStatus] = useState<{
    triggered: boolean;
    message: string;
    buy?: number;
    sell?: number;
    threshold?: number;
    enabled?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      threshold: 7.0,
      enabled: false,
    },
    validationSchema: Yup.object({
      threshold: Yup.number()
        .min(0, "El umbral debe ser mayor o igual a 0")
        .required("El umbral es obligatorio"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await updateUserAlertSettings(
          CURRENT_USER_ID,
          values.threshold,
          values.enabled
        );
        const alertResult = await checkAlert(CURRENT_USER_ID);
        setAlertStatus(alertResult);
      } catch (error) {
        console.error(
          "Error al actualizar las configuraciones de alerta:",
          error
        );
        setAlertStatus({
          triggered: false,
          message:
            "Error al actualizar las configuraciones. Inténtalo de nuevo.",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchAlertStatus = async () => {
      setLoading(true);
      try {
        const { alertThreshold, alertEnabled } = await getUserAlertSettings(
          CURRENT_USER_ID
        );
        formik.setValues({
          threshold: alertThreshold || 7.0,
          enabled: alertEnabled || false,
        });
        const alertResult = await checkAlert(CURRENT_USER_ID);
        setAlertStatus(alertResult);
      } catch (error) {
        console.error("Error al verificar la alerta:", error);
        setAlertStatus({
          triggered: false,
          message: "Error al verificar la alerta. Inténtalo de nuevo.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAlertStatus();
  }, []);

  const handleSimulateChange = async () => {
    setLoading(true);
    try {
      const alertResult = await simulateAlertCheck(CURRENT_USER_ID);
      setAlertStatus(alertResult);
    } catch (error) {
      console.error("Error al simular la alerta:", error);
      setAlertStatus({
        triggered: false,
        message: "Error al simular la alerta. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Configurar Alerta de Tipo de Cambio (USD)
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="threshold"
          name="threshold"
          label="Umbral de Alerta (USD)"
          type="number"
          value={formik.values.threshold}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.threshold && Boolean(formik.errors.threshold)}
          helperText={formik.touched.threshold && formik.errors.threshold}
          sx={{ mb: 2 }}
          inputProps={{ step: "0.01" }}
          disabled={!formik.values.enabled}
        />
        <FormControlLabel
          control={
            <Switch
              checked={formik.values.enabled}
              onChange={(e) =>
                formik.setFieldValue("enabled", e.target.checked)
              }
              name="enabled"
            />
          }
          label={
            formik.values.enabled ? "Alerta Activada" : "Alerta Desactivada"
          }
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            Guardar Configuración
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            type="button"
            onClick={handleSimulateChange}
            disabled={loading || !formik.values.enabled}
          >
            Simular Cambio
          </Button>
        </Box>
      </form>

      {alertStatus && (
        <Box sx={{ mt: 3 }}>
          <Alert
            icon={
              alertStatus.triggered && alertStatus.enabled ? (
                <WarningIcon fontSize="inherit" />
              ) : (
                <InfoIcon fontSize="inherit" />
              )
            }
            severity={
              alertStatus.triggered && alertStatus.enabled ? "warning" : "info"
            }
          >
            {alertStatus.message}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default AlertSettings;
