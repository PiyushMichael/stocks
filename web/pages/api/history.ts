import { ResponseData, TransformedType } from "@/types";
import { fetchAndUpdate } from "@/utils/helpers";
import type { NextApiRequest, NextApiResponse } from "next";

const transformResponse = (data: ResponseData): TransformedType => {
  const obj: TransformedType = {
    meta_data: {
      info: data["Meta Data"]["1. Information"],
      last_refreshed: data["Meta Data"]["3. Last Refreshed"],
      symbol: data["Meta Data"]["2. Symbol"],
      output_size: data["Meta Data"]["4. Output Size"],
      time_zone: data["Meta Data"]["5. Time Zone"],
    },
    time_series_daily: Object.keys(data["Time Series (Daily)"]).reduce<
      TransformedType["time_series_daily"]
    >((acc, key) => {
      acc[key] = {
        open: data["Time Series (Daily)"][key]["1. open"],
        close: data["Time Series (Daily)"][key]["4. close"],
        high: data["Time Series (Daily)"][key]["2. high"],
        low: data["Time Series (Daily)"][key]["3. low"],
        volume: data["Time Series (Daily)"][key]["5. volume"],
      };
      return acc;
    }, {}),
  };
  return obj;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TransformedType>
) {
  const { stock_code } = req.query;
  if (!stock_code) {
    return res.status(400);
  }

  const data = await fetchAndUpdate(stock_code as string);

  const repsonse = transformResponse(data);
  return res.status(200).json(repsonse);
}
