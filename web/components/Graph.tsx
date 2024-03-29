import { useGetHistory } from "@/api/useGetHistory";
import React from "react";

export default function Graph() {
  const { data: history } = useGetHistory({
    from_date: "2023-04-01",
    to_date: "2024-09-01",
    stock_code: "RELIANCE",
  });
  console.log(Object.entries(history?.time_series_daily || {}));

  return (
    <div>
      gaph here
      <div>{history?.meta_data.symbol}</div>
      <div>{history?.meta_data.last_refreshed}</div>
      {history?.time_series_daily &&
        Object.entries(history.time_series_daily).map(([key, val]) => (
          <div key={`${key}-entry`}>
            <p>
              {key}: {val.open}, {val.close}, {val.high}, {val.low},{" "}
              {val.volume}
            </p>
          </div>
        ))}
    </div>
  );
}
