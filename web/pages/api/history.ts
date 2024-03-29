import type { NextApiRequest, NextApiResponse } from "next";

const api_key = "PN8U6IS077BTGJ3Y";

type ResponseData = {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Output Size": string;
    "5. Time Zone": string;
  };
  "Time Series (Daily)": {
    [key: string]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. volume": string;
    };
  };
  Information?: string;
};

type TransformedType = {
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

const transformResponse = (data: ResponseData): TransformedType => {
  const obj: TransformedType = {
    meta_data: {
      info: data["Meta Data"]["1. Information"],
      last_refreshed: data["Meta Data"]["3. Last Refreshed"],
      symbol: data["Meta Data"]["2. Symbol"],
      output_size: data["Meta Data"]["4. Output Size"],
      time_zone: data["Meta Data"]["5. Time Zone"],
    },
    time_series_daily: Object.keys(data).reduce<
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
  const { to_date, from_date, stock_code } = req.query;
  if (!to_date || !from_date || !stock_code) {
    return res.status(400);
  }

  const URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock_code}.BSE&apikey=${api_key}&outputsize=compact`;
  const data: ResponseData = await fetch(URL).then((res) => res.json());
  if (data.Information) {
    return res.status(400);
  }

  return res.status(200).json(transformResponse(data));
}