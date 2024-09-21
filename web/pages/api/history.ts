import { TransformedType } from "@/types";
import { fetchAndUpdate, transformResponse } from "@/utils/helpers";
import type { NextApiRequest, NextApiResponse } from "next";

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
