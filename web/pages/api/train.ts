import {
  TRAINING_PROJECTION_SAMPLE_SIZE,
  TRAINING_SLIDING_WINDOW_SIZE,
  TRAINING_TREND_SAMPLE_SIZE,
} from "@/constants/app_contants";
import { TransformedType } from "@/types";
import { fetchAndUpdate, transformResponse } from "@/utils/helpers";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 *
 * @param res TransformedType
 * @returns Array<[high, open, close, low, volume][25], [high, open, close, low, volume][5]>
 */
const generateTrainingData = (res: TransformedType) => {
  // turning stock history into Array of [high, open, close, low, volume]
  const list = Object.keys(res.time_series_daily)
    .sort()
    .map((key) => {
      const { high, open, close, low, volume } = res.time_series_daily[key];
      return [high, open, close, low, volume].map((str) => parseFloat(str));
    });

  // Array of [high, open, close, low, volume][25] as sample + [high, open, close, low, volume][5] as projections
  const figures = [];
  // loop for generating sliding window which increments 5 (or TRAINING_SLIDING_WINDOW_SIZE) at a time
  for (
    let i = 0;
    i + TRAINING_TREND_SAMPLE_SIZE + TRAINING_PROJECTION_SAMPLE_SIZE <
    list.length;
    i += TRAINING_SLIDING_WINDOW_SIZE
  ) {
    // Sample Array of [high, open, close, low, volume] with 25 (or TRAINING_TREND_SAMPLE_SIZE) items.
    const trends = Array.from(
      { length: TRAINING_TREND_SAMPLE_SIZE },
      (_, index) => list[i + index]
    );
    // Projections Array of [high, open, close, low, volume] with 25 (or TRAINING_TREND_SAMPLE_SIZE) items.
    const projections = Array.from(
      { length: TRAINING_PROJECTION_SAMPLE_SIZE },
      (_, index) => list[i + TRAINING_TREND_SAMPLE_SIZE + index]
    );
    figures.push([trends, projections]);
  }
  return figures;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { stock_code } = req.query;
  if (!stock_code) {
    return res.status(400);
  }

  const data = await fetchAndUpdate(stock_code as string);

  const repsonse = generateTrainingData(transformResponse(data));
  return res.status(200).json(repsonse);
}
