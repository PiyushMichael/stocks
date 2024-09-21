import React, { useCallback } from "react";
import moment from "moment";
import { APP_BAR_HEIGHT, CANDLES_PER_PAGE } from "@/constants/app_contants";
import { Graphics, Text } from "@pixi/react";
import { TextStyle } from "@pixi/text";

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
            {/* line */}
            <Graphics
              draw={(g) => {
                g.clear();
                g.lineStyle(1, "grey");
                g.moveTo(spacingX * (i + 1), 0);
                g.lineTo(spacingX * (i + 1), height);
                g.endFill();
              }}
            />
            {/* text */}
            <Text
              text={getDateString(i)}
              x={spacingX * (i + 1) - 60}
              y={height + 32 - APP_BAR_HEIGHT}
              style={new TextStyle({ fontSize: 16 })}
            />
          </>
        ))}
    </>
  );
};

export default LegendX;
