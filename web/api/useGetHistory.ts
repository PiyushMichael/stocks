import { useQuery } from "react-query";
import { GET } from "./axiosHelpers";

type HistoryType = {
  meta_data: {
    info: string;
    symbol: string;
    last_refreshed: string;
    output_size: string;
    time_zone: string;
  };
  time_series_daily: {
    [key: string]: {
      open: string;
      high: string;
      low: string;
      close: string;
      volume: string;
    };
  };
};

export const useGetHistory = ({
  from_date,
  to_date,
  stock_code,
}: {
  from_date: string;
  to_date: string;
  stock_code: string;
}) => {
  return useQuery({
    queryKey: "history",
    queryFn: () =>
      GET<HistoryType>(
        `/api/history?from_date=${from_date}&to_date=${to_date}&stock_code=${stock_code}`
      ),
  });
};
