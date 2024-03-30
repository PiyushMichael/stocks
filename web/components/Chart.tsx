import React, { useCallback, useMemo, useState } from "react";
import * as d3 from "d3";

import Candle from "./Candle";
import CrossHairs from "./CrossHairs";
import { ChartDataType } from "./Graph";

const CANDLE_WIDTH = 6;
const CANGDLE_OFFSET = 9.6;

export type ChartDimension = {
  pixel_width: number;
  pixel_height: number;
  dollar_high: number;
  dollar_low: number;
  dollar_delta: number;
};

// derived from https://codesandbox.io/s/react-d3-candlestick-chart-h0fs0
// By https://codesandbox.io/u/GregX999

const Chart = ({ data }: { data: ChartDataType[] }) => {
  const view_width = 960;
  const chart_width = data ? data.length * 6 : view_width;
  const chart_height = 600;

  // last_bar_idx should default to the last bar in the data, or else be sure passed-in value doesn't exceed the last bar
  // last_bar_idx = last_bar_idx > 0 ? Math.min(last_bar_idx, data.length - 1) : data.length - 1;

  const [mouseCoords, setMouseCoords] = useState({
    x: 0,
    y: 0,
  });

  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // find the high and low bounds of all the bars being sidplayed
  const dollar_high = useMemo(
    () => (d3.max(data.map((bar) => bar.high)) as number) * 1.05,
    [data]
  );
  const dollar_low = useMemo(
    () => (d3.min(data.map((bar) => bar.low)) as number) * 0.95,
    [data]
  );

  const chart_dims: ChartDimension = useMemo(
    () => ({
      pixel_width: chart_width,
      pixel_height: chart_height,
      dollar_high,
      dollar_low,
      dollar_delta: dollar_high - dollar_low,
    }),
    [chart_width, dollar_high, dollar_low]
  );

  const dollarAt = useCallback(
    (pixel: number): string => {
      const dollar =
        (Math.abs(pixel - chart_dims.pixel_height) / chart_dims.pixel_height) *
          chart_dims.dollar_delta +
        chart_dims.dollar_low;

      return pixel > 0 ? dollar.toFixed(2) : "-";
    },
    [chart_dims]
  );

  const pixelFor = useCallback(
    (dollar: number): number => {
      return Math.abs(
        ((dollar - chart_dims["dollar_low"]) / chart_dims["dollar_delta"]) *
          chart_dims["pixel_height"] -
          chart_dims["pixel_height"]
      );
    },
    [chart_dims]
  );

  const onMouseLeave: React.MouseEventHandler<SVGSVGElement> =
    useCallback(() => {
      setMouseCoords({
        x: 0,
        y: 0,
      });
    }, []);

  const onMouseMoveInside: React.MouseEventHandler<SVGSVGElement> = useCallback(
    (e) => {
      setMouseCoords({
        x:
          e.nativeEvent.x -
          Math.round(e.currentTarget.getBoundingClientRect().left),
        y:
          e.nativeEvent.y -
          Math.round(e.currentTarget.getBoundingClientRect().top),
      });
    },
    []
  );

  const onMouseClickInside: React.MouseEventHandler<SVGSVGElement> =
    useCallback((e) => {
      console.log(
        `Click at ${e.nativeEvent.offsetX}, ${e.nativeEvent.offsetY}`
      );
    }, []);

  return (
    <div
      id="chart-container"
      style={{ backgroundColor: "#ddd", overflowX: "auto", width: view_width }}
      onMouseDown={(e) => {
        const slider = document.querySelector("#chart-container");
        setIsScrolling(true);
        setStartX(e.pageX - slider.offsetLeft);
        setScrollLeft(slider.scrollLeft);
      }}
      onMouseUp={() => setIsScrolling(false)}
      onMouseMove={(e) => {
        e.preventDefault();
        const slider = document.querySelector("#chart-container");
        if (!isScrolling) {
          return;
        }
        const x = e.pageX - slider.offsetLeft;
        const scroll = x - startX;
        slider.scrollLeft = scrollLeft - scroll;
      }}
    >
      <svg
        width={chart_width}
        height={chart_height}
        onMouseMove={onMouseMoveInside}
        onClick={onMouseClickInside}
        onMouseLeave={onMouseLeave}
      >
        {data.map((bar, i) => {
          const candle_x = CANGDLE_OFFSET * (i + 1);
          return (
            <Candle
              key={i}
              data={bar}
              x={candle_x}
              candle_width={CANDLE_WIDTH}
              pixelFor={pixelFor}
            />
          );
        })}

        <CrossHairs
          x={mouseCoords.x}
          y={mouseCoords.y}
          chart_dims={chart_dims}
        />
      </svg>
      <div style={{ position: "absolute", top: 10, left: 16 }}>
        <div>
          Mouse: {mouseCoords.x}, {mouseCoords.y}
        </div>
        <div>Dollars: ${dollarAt(mouseCoords.y)}</div>
      </div>
    </div>
  );
};

export default Chart;
