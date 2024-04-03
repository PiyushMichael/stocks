import type { NextApiRequest, NextApiResponse } from "next";
import STOCKS from "@/constants/stocks.json";

// JSON downloaded from https://www.bseindia.com/corporates/List_Scrips.html

type JSON_ENTRIES = {
  "Security Code": number;
  "Issuer Name": string;
  "Security Id": string;
  "Security Name": string;
  Status: string;
  Group: string;
  "Face Value": 2;
  "ISIN No": string;
  Industry: string;
  Instrument: string;
  "Sector Name": string;
  "Industry New Name": string;
  "Igroup Name": string;
  "ISubgroup Name": string;
};

type TransformedType = {
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

const transformJSON = (data: JSON_ENTRIES[]): TransformedType[] => {
  const res: TransformedType[] = data.map((stock) => ({
    security_code: stock["Security Code"],
    issuer_name: stock["Issuer Name"],
    security_id: stock["Security Id"],
    security_name: stock["Security Name"],
    status: stock.Status,
    group: stock.Group,
    face_value: stock["Face Value"],
    isin_no: stock["ISIN No"],
    industry: stock.Industry,
    instrument: stock.Instrument,
    sector_name: stock["Sector Name"],
    industry_new_name: stock["Industry New Name"],
    igroup_name: stock["Igroup Name"],
    iSubgroup_name: stock["ISubgroup Name"],
  }));
  return res;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TransformedType[]>
) {
  const { search } = req.query;
  const stocks = transformJSON(STOCKS as JSON_ENTRIES[]);
  const filtered = stocks.filter((stock) => {
    const regex = new RegExp(`${search}`, "i");
    return (
      regex.test(stock.security_id) ||
      regex.test(stock.security_name) ||
      regex.test(stock.issuer_name)
    );
  });

  return res.status(200).json(filtered);
}
