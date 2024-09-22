import {
  TRAINING_NORMALISATION_MARGIN_PERCENT,
  TRAINING_NORMALISATION_MAX,
  TRAINING_PROJECTION_SAMPLE_SIZE,
  TRAINING_SLIDING_WINDOW_SIZE,
  TRAINING_TREND_SAMPLE_SIZE,
} from "@/constants/app_contants";
import { TransformedType } from "@/types";
import { convertToHex, fetchAndUpdate, transformResponse } from "@/utils/helpers";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * function to scale a number down to max TRAINING_NORMALISATION_MAX
 * and with TRAINING_NORMALISATION_MARGIN_PERCENT margin
 */
const normalise = (num: number, min: number, max: number) => {
  const diff = max - min;
  const high = max + (diff * TRAINING_NORMALISATION_MARGIN_PERCENT) / 100;
  const low = min - (diff * TRAINING_NORMALISATION_MARGIN_PERCENT) / 100;
  const bracket = high - low;
  const coeff = bracket / TRAINING_NORMALISATION_MAX;

  return Math.round((num - low) / coeff);
};

/**
 * Function to normalize Array<[high, open, close, low, volume][25], [high, open, close, low, volume][5]>
 * 25 is subsctituted with TRAINING_TREND_SAMPLE_SIZE and 5 with TRAINING_PROJECTION_SAMPLE_SIZE
 */
const normaliseFigures = (arr: number[][][][]) => {
  // generate combined slot array of samples + projections
  const slots = arr.map(([samples, projections]) => [
    ...samples,
    ...projections,
  ]);

  const allSlotSamplesValues = slots.map((slot) => {
    // all stock history values of a slot
    const allSlotValues = slot
      .map(([high, open, close, low]) => [high, open, close, low])
      .flat();
    const valuesMin = Math.min(...allSlotValues);
    const valuesMax = Math.max(...allSlotValues);

    // all volume values of a slot
    const allSlotVolumes = slot.map((slotArr) => slotArr[4]);
    const volumesMin = Math.min(...allSlotVolumes);
    const volumesMax = Math.max(...allSlotVolumes);

    // generating normalised stock value and volume numbers
    const normalisedSlots = slot.map(([high, open, close, low], i) => [
      convertToHex(normalise(high, valuesMin, valuesMax)),
      convertToHex(normalise(open, valuesMin, valuesMax)),
      convertToHex(normalise(close, valuesMin, valuesMax)),
      convertToHex(normalise(low, valuesMin, valuesMax)),
      convertToHex(normalise(allSlotVolumes[i], volumesMin, volumesMax)),
    ]);

    // bifurcating nomralised slots back into samples and projections
    return [
      normalisedSlots.slice(0, TRAINING_TREND_SAMPLE_SIZE),
      normalisedSlots.slice(-TRAINING_PROJECTION_SAMPLE_SIZE),
    ];
  });

  return allSlotSamplesValues;
};

/**
 *
 * @param res TransformedType
 * @returns Array<[high, open, close, low, volume][25], [high, open, close, low, volume][5]>
 * 25 is subsctituted with TRAINING_TREND_SAMPLE_SIZE and 5 with TRAINING_PROJECTION_SAMPLE_SIZE
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

  return normaliseFigures(figures);
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
