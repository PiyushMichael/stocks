import { useGetHistory } from "@/api/useGetHistory";
import { useMemo, useState } from "react";
import Chart from "./Chart";
import { useGetStocks } from "@/api/useGetStocks";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { CANDLES_PER_PAGE } from "@/constants/app_contants";
import { Autocomplete, TextField } from "@mui/material";

export type ChartDataType = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export default function Graph() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stepBacks, setStepBacks] = useState(1);
  const [stockCode, setStockCode] = useState("TATAPOWER");
  const { data: history } = useGetHistory({ stock_code: stockCode });
  const { data: stocks } = useGetStocks({ search: searchTerm });

  const stockResults = useMemo(() => {
    if (stocks) {
      return stocks
        .map((stock) => ({
          label: stock.security_name,
          value: stock.security_id,
        }))
        .slice(0, 100);
    }
    return [];
  }, [stocks]);

  const chartData: ChartDataType[] = useMemo(() => {
    const end =
      stepBacks === 1 ? undefined : -CANDLES_PER_PAGE * (stepBacks - 1);
    return history?.time_series_daily
      ? Object.keys(history?.time_series_daily)
          .map((key, i) => ({
            open: parseFloat(history.time_series_daily[key].open),
            close: parseFloat(history.time_series_daily[key].close),
            low: parseFloat(history.time_series_daily[key].low),
            high: parseFloat(history.time_series_daily[key].high),
            volume: parseFloat(history.time_series_daily[key].volume),
          }))
          .slice(-CANDLES_PER_PAGE * stepBacks, end)
      : [];
  }, [history, stepBacks]);

  const historyLength = Object.keys(history?.time_series_daily || {}).length;

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            disabled={stepBacks * CANDLES_PER_PAGE > historyLength}
            onClick={() => setStepBacks(stepBacks + 1)}
          >
            <ChevronLeft fontSize="large" />
          </IconButton>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            disabled={stepBacks === 1}
            onClick={() => setStepBacks(stepBacks - 1)}
          >
            <ChevronRight fontSize="large" />
          </IconButton>
          <Typography variant="h5" color="inherit" component="div">
            Stocks
          </Typography>
          <Autocomplete
            disablePortal
            onChange={(_e, val) => {
              if (val?.value) {
                setStockCode(val.value);
              }
            }}
            id="combo-box-demo"
            options={stockResults}
            sx={{ width: 300, marginLeft: 2, marginRight: 2 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ color: "#fff" }}
              />
            )}
          />
          <Typography variant="h6" color="inherit" component="div">
            {history?.meta_data.symbol ?? "--"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Chart data={chartData} meta={history?.meta_data} steps={stepBacks} />
    </>
  );
}
