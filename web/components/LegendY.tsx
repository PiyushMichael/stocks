import React from "react";

const LegendY = ({
  spacingY,
  count,
  width,
  rupeesAt,
}: {
  spacingY: number;
  count: number;
  width: number;
  rupeesAt: (v: number) => string;
}) => {
  // const getDateString = useCallback(
  //   (index: number) => {
  //     const lastUpdateDate = moment(lastUpdated);
  //     return lastUpdateDate.subtract((count - index - 1) * 20, "days").format("ll");
  //   },
  //   [count, lastUpdated]
  // );

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_c, i) => (
          <>
            <line
              key={`y-legend-${i}`}
              x1={0}
              x2={width}
              y1={spacingY * (i + 1) + 10}
              y2={spacingY * (i + 1) + 10}
              stroke="grey"
              strokeWidth={0.5}
            />
            <text x={4} y={spacingY * i + 16}>
              {rupeesAt(spacingY * i + 16)}
            </text>
          </>
        ))}
    </>
  );
};

export default LegendY;
