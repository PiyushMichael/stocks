import React, { useCallback } from "react";
import moment from "moment";

const LegendX = ({
  spacingX,
  count,
  height,
  lastUpdated,
}: {
  spacingX: number;
  count: number;
  height: number;
  lastUpdated?: string;
}) => {
  const getDateString = useCallback(
    (index: number) => {
      const lastUpdateDate = moment(lastUpdated);
      return lastUpdateDate.subtract((count - index - 1) * 20, "days").format("ll");
    },
    [count, lastUpdated]
  );

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_c, i) => (
          <>
            <line
              key={`y-legend-${i}`}
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
