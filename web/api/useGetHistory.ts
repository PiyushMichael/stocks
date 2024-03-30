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

export const useGetHistory = ({ stock_code }: { stock_code: string }) => {
  return useQuery({
    queryKey: "history",
    queryFn: () => GET<HistoryType>(`/api/history?stock_code=${stock_code}`),
  });
};
