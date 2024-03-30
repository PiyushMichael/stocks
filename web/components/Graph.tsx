import { useGetHistory } from "@/api/useGetHistory";
import { useMemo, useState } from "react";
import Chart from "./Chart";
import { range } from "d3";

type ChartDataType = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}[];

export default function Graph() {
  const { data: history } = useGetHistory({ stock_code: "RELIANCE" });
  const chartData: ChartDataType = useMemo(
    () =>
      history?.time_series_daily
        ? Object.keys(history?.time_series_daily).map((key, i) => ({
            time: i, // new Date(key),
            open: parseFloat(history.time_series_daily[key].open),
            close: parseFloat(history.time_series_daily[key].close),
            low: parseFloat(history.time_series_daily[key].low),
            high: parseFloat(history.time_series_daily[key].high),
            volume: parseFloat(history.time_series_daily[key].volume),
          })).slice(0, 100)
        : [],
    [history]
  );

  const chart_width = 960;
  const chart_height = 600;

  return (
    <div style={{ backgroundColor: "grey" }}>
      <Chart data={chartData} width={chart_width} height={chart_height} />
    </div>
  );
}
