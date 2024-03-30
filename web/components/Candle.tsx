import React, { useMemo } from "react";
import { ChartDataType } from "./Graph";

const Candle = ({
  data,
  x,
  candle_width,
  pixelFor,
}: {
  data: ChartDataType;
  x: number;
  candle_width: number;
  pixelFor: (x: number) => number;
}) => {
  const up = useMemo(() => data.close > data.open, [data]);
  const bar_top = useMemo(
    () => pixelFor(up ? data.close : data.open),
    [up, data, pixelFor]
  );
  const bar_bottom = useMemo(
    () => pixelFor(up ? data.open : data.close),
    [up, data, pixelFor]
  );
  const bar_height = useMemo(() => bar_bottom - bar_top, [bar_bottom, bar_top]);
  const wick_top = useMemo(() => pixelFor(data.high), [data, pixelFor]);
  const wick_bottom = useMemo(() => pixelFor(data.low), [data, pixelFor]);

  const color = useMemo(() => (up ? "red" : "green"), [up]);

  return (
    <>
      <rect
        x={x - candle_width / 2}
        y={bar_top}
        width={candle_width}
        height={bar_height}
        fill={color}
      />
      <line
        x1={x}
        y1={bar_top}
        x2={x}
        y2={wick_top}
        stroke={color}
        strokeWidth={1}
      />
      <line
        x1={x}
        y1={bar_bottom}
        x2={x}
        y2={wick_bottom}
        stroke={color}
        strokeWidth={1}
      />
    </>
  );
};

export default Candle;
