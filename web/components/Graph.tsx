import { useGetHistory } from "@/api/useGetHistory";
import { useMemo } from "react";
import Chart from "./Chart";

export type ChartDataType = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export default function Graph() {
  const { data: history } = useGetHistory({ stock_code: "RELIANCE" });
  const chartData: ChartDataType[] = useMemo(
    () =>
      history?.time_series_daily
        ? Object.keys(history?.time_series_daily)
            .map((key, i) => ({
              time: i, // new Date(key),
              open: parseFloat(history.time_series_daily[key].open),
              close: parseFloat(history.time_series_daily[key].close),
              low: parseFloat(history.time_series_daily[key].low),
              high: parseFloat(history.time_series_daily[key].high),
              volume: parseFloat(history.time_series_daily[key].volume),
            }))
            .slice(0, 200)
        : [],
    [history]
  );

  return <Chart data={chartData} />;
}
