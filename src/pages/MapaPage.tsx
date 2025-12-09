import { Grid, Typography, Card, CardContent } from "@mui/material";
import ExchangeMap from "../components/ExchangeMap";
import { useEffect, useState } from "react";
import jsonServerInstance from "../api/jsonInstance";

const MapaPage = () => {
  const [exchangeHouses, setExchangeHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await jsonServerInstance.get("/exchangeHouses");
      setExchangeHouses(response.data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
     <Typography variant="h4" gutterBottom>
      </Typography>

      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            maxHeight: { xs: "300px", md: "600px" },
            overflowY: "auto",
            pr: { md: 1 },
          }}
        >
          <Grid container spacing={2}>
            {exchangeHouses.map((house: any) => (
              <Grid size={12} key={house.id}>
                <Card
                  variant="outlined"
                  onClick={() => setSelectedHouse(house)}
                  sx={{
                    cursor: "pointer",
                    borderColor:
                      selectedHouse?.id === house.id
                        ? "primary.main"
                        : "grey.300",
                    backgroundColor:
                      selectedHouse?.id === house.id ? "lightblue" : "white",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{house.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dirección: {house.address}
                    </Typography>
                    <Typography variant="body2">
                      Moneda: {house.currency}
                    </Typography>
                    <Typography variant="body2">
                      Compra: {house.buy} | Venta: {house.sell}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Mapa */}
        <Grid size={{ xs: 12, md: 7 }}>
          <div
            style={{
              height: "600px",
              width: "100%",
              marginTop: window.innerWidth < 900 ? "1rem" : 0, 
            }}
          >
            <ExchangeMap selectedHouse={selectedHouse} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default MapaPage;
