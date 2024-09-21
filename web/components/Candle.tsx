import React, { useMemo } from "react";
import { ChartDataType } from "./Graph";
import { Graphics } from "@pixi/react";

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
      {/* Candle */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(color);
          g.drawRect(x - candle_width / 2, bar_top, candle_width, bar_height);
          g.endFill();
        }}
      />
      {/* Top Wick */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.lineStyle(1, color);
          g.moveTo(x, wick_top);
          g.lineTo(x, bar_top);
          g.endFill();
        }}
      />
      {/* Bottom Wick */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.lineStyle(1, color);
          g.moveTo(x, bar_bottom);
          g.lineTo(x, wick_bottom);
          g.endFill();
        }}
      />
    </>
  );
};

export default Candle;
