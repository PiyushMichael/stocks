import { useQuery } from "react-query";
import { GET } from "./axiosHelpers";

type StockType = {
  security_code: number;
  issuer_name: string;
  security_id: string;
  security_name: string;
  status: string;
  group: string;
  face_value: 2;
  isin_no: string;
  industry: string;
  instrument: string;
  sector_name: string;
  industry_new_name: string;
  igroup_name: string;
  iSubgroup_name: string;
};

export const useGetStocks = ({ search }: { search: string }) => {
  return useQuery({
    queryKey: "stocks",
    queryFn: () => GET<StockType[]>(`/api/stocks?search=${search}`),
  });
};
