import { api_key } from "@/constants/app_contants";
import { ResponseData } from "@/types";
import fs from "fs";

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
