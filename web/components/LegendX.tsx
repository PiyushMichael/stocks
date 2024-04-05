import React, { useCallback } from "react";
import moment from "moment";
import { CANDLES_PER_PAGE } from "@/constants/app_contants";

const LegendX = ({
  spacingX,
  count,
  height,
  lastUpdated,
  steps,
}: {
  spacingX: number;
  count: number;
  height: number;
  lastUpdated?: string;
  steps: number;
}) => {
  const getDateString = useCallback(
    (index: number) => {
      const lastUpdateDate = moment(lastUpdated);
      return lastUpdateDate
        .subtract(
          (count - index - 1) * (CANDLES_PER_PAGE / count) +
            (steps - 1) * CANDLES_PER_PAGE,
          "days"
        )
        .format("ll");
    },
    [count, lastUpdated, steps]
  );

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_c, i) => (
          <>
            <line
              key={`x-legend-${i}`}
              x1={spacingX * (i + 1)}
              x2={spacingX * (i + 1)}
              y1={0}
              y2={height}
              stroke="grey"
              strokeWidth={0.5}
            />
            <text x={spacingX * (i + 1) - 60} y={height - 10}>
              {getDateString(i)}
            </text>
          </>
        ))}
    </>
  );
};

export default LegendX;
