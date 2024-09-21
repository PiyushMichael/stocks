export type ResponseData = {
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

export type TransformedType = {
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
