import React from "react";
import { ChartDimension } from "./Chart";
import { Graphics } from "@pixi/react";
import { APP_BAR_HEIGHT } from "@/constants/app_contants";

const CrossHairs = ({
  x,
  y,
  offset,
  chart_dims,
}: {
  x: number;
  y: number;
  offset: number;
  chart_dims: ChartDimension;
}) => {
  if (x + y === 0) {
    return <></>;
  }

  return (
    <>
      {/* X - hair */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.lineStyle(1, "red");
          g.moveTo(0 - offset, y - APP_BAR_HEIGHT);
          g.lineTo(chart_dims.pixel_width, y - 1 - APP_BAR_HEIGHT);
          g.endFill();
        }}
      />
      {/* Y - Hair */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.lineStyle(1, "red");
          g.moveTo(x - offset, 0);
          g.lineTo(x - offset, chart_dims.pixel_height);
          g.endFill();
        }}
      />
    </>
  );
};

export default CrossHairs;
