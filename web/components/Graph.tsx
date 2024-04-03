import { useGetHistory } from "@/api/useGetHistory";
import { useMemo, useState } from "react";
import Chart from "./Chart";
import { useGetStocks } from "@/api/useGetStocks";

export type ChartDataType = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export default function Graph() {
  const [search, setSearch] = useState("");
  const { data: history } = useGetHistory({ stock_code: "RELIANCE" });
  const { data: stocks } = useGetStocks({ search: "RELIANCE" });

  const chartData: ChartDataType[] = useMemo(
    () =>
      history?.time_series_daily
        ? Object.keys(history?.time_series_daily)
            .map((key, i) => ({
              open: parseFloat(history.time_series_daily[key].open),
              close: parseFloat(history.time_series_daily[key].close),
              low: parseFloat(history.time_series_daily[key].low),
              high: parseFloat(history.time_series_daily[key].high),
              volume: parseFloat(history.time_series_daily[key].volume),
            }))
            .slice(-400)
        : [],
    [history]
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 120,
        }}
      >
        <input list="browsers" name="browser" id="browser" />
        <datalist id="browsers">
          <option value="Edge" />
          <option value="Firefox" />
          <option value="Chrome" />
          <option value="Opera" />
          <option value="Safari" />
        </datalist>
      </div>
      <Chart data={chartData} meta={history?.meta_data} />
    </>
  );
}
