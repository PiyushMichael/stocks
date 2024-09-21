import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as d3 from "d3";

import Candle from "./Candle";
import CrossHairs from "./CrossHairs";
import { ChartDataType } from "./Graph";
import { useScreenSize } from "@/hooks/useScreenSize";
import { HistoryType } from "@/api/useGetHistory";
import LegendX from "./LegendX";
import LegendY from "./LegendY";
import {
  APP_BAR_HEIGHT,
  CANDLE_WIDTH,
  CANGDLE_OFFSET,
  LEGEND_X_SPACING,
  LEGEND_X_STEPS,
  LEGEND_Y_STEPS,
} from "@/constants/app_contants";

import "@pixi/events";
import { Stage, Container } from "@pixi/react";

export type ChartDimension = {
  pixel_width: number;
  pixel_height: number;
  dollar_high: number;
  dollar_low: number;
  dollar_delta: number;
};

// derived from https://codesandbox.io/s/react-d3-candlestick-chart-h0fs0
// By https://codesandbox.io/u/GregX999

const Chart = ({
  data,
  meta,
  steps,
}: {
  data: ChartDataType[];
  meta?: HistoryType["meta_data"];
  steps: number;
}) => {
  const { width, height } = useScreenSize();
  const view_width = width;
  const chart_width = data ? data.length * 9.7 : view_width;
  const chart_height = height - APP_BAR_HEIGHT;

  // last_bar_idx should default to the last bar in the data, or else be sure passed-in value doesn't exceed the last bar
  // last_bar_idx = last_bar_idx > 0 ? Math.min(last_bar_idx, data.length - 1) : data.length - 1;

  const [mouseCoords, setMouseCoords] = useState({
    x: 0,
    y: 0,
  });

  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState<number>();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const slider = document.querySelector("#chart-container");
    if (slider) {
      slider.scrollLeft = chart_width;
    }
  }, [chart_width, data]);

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
    [chart_height, chart_width, dollar_high, dollar_low]
  );

  const rupeesAt = useCallback(
    (pixel: number): string => {
      const dollar =
        (Math.abs(pixel - chart_dims.pixel_height) / chart_dims.pixel_height) *
        chart_dims.dollar_delta +
        chart_dims.dollar_low;

      return pixel > 0 ? `₹${dollar.toFixed(2)}` : "-";
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

  return (
    <Stage
      onMouseDown={(e) => {
        setStartX(e.pageX - offset);
        setIsScrolling(true);
      }}
      onMouseUp={() => {
        setStartX(undefined);
        setIsScrolling(false);
      }}
      onMouseMoveCapture={(e) => {
        if (isScrolling && startX !== undefined) {
          if (e.pageX - startX <= 0) {
            if ((e.pageX - startX + chart_width) >= view_width) {
              setOffset(e.pageX - startX);
            } else {
              setOffset(view_width - chart_width)
            }
          } else {
            setOffset(0)
          }
        }
        setMouseCoords({ x: e.pageX, y: e.pageY });
      }}
      options={{ background: '#ddd' }}
      width={view_width}
      height={chart_height}
    >
      <Container x={offset}>
        {data.map((bar, i) => (
          <Candle
            key={i}
            data={bar}
            x={CANGDLE_OFFSET * (i + 1)}
            candle_width={CANDLE_WIDTH}
            pixelFor={pixelFor}
          />
        ))}
        <CrossHairs
          x={mouseCoords.x}
          y={mouseCoords.y}
          offset={offset}
          chart_dims={chart_dims}
        />
        <LegendX
          spacingX={LEGEND_X_SPACING}
          count={LEGEND_X_STEPS}
          height={chart_height}
          lastUpdated={meta?.last_refreshed}
          steps={steps}
        />
        <LegendY
          spacingY={chart_height / 5}
          count={LEGEND_Y_STEPS}
          width={chart_width}
          rupeesAt={rupeesAt}
        />
      </Container>
    </Stage>
  );
};

export default Chart;
