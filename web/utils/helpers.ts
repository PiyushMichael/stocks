import { api_key } from "@/constants/app_contants";
import { ResponseData, TransformedType } from "@/types";
import fs from "fs";

export const transformResponse = (data: ResponseData): TransformedType => {
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

const readFile = (stock_code: string) =>
  new Promise<ResponseData>((res, rej) => {
    fs.readFile(`./public/json/${stock_code}.json`, (err, files) => {
      if (err) {
        rej(err);
        return;
      }
      try {
        res(JSON.parse(files.toString()));
      } catch (e) {
        rej(e);
      }
    });
  });

const writeFile = (stock_code: string, json: any) =>
  new Promise<void>((res, rej) => {
    fs.writeFile(`./public/json/${stock_code}.json`, JSON.stringify(json), () =>
      res()
    );
  });

export const fetchAndUpdate = (stock_code: string) =>
  new Promise<ResponseData>((res, rej) => {
    const URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock_code}.BSE&apikey=${api_key}&outputsize=full`;
    // readFile(stock_code).then(res).catch(rej);
    fetch(URL)
      .then((res) => res.json())
      .then((data: ResponseData) => {
        if (data.Information) {
          readFile(stock_code).then(res).catch(rej);
        } else {
          writeFile(stock_code, data);
          res(data);
        }
      })
      .catch(() => {
        readFile(stock_code).then(res).catch(rej);
      });
  });
