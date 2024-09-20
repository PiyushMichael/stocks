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
          g.beginFill("red");
          g.drawRect(0 - offset, y - 1 - APP_BAR_HEIGHT, chart_dims.pixel_width, 1);
          g.endFill();
        }}
      />
      {/* Y - Hair */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill("red");
          g.drawRect(x - 1 - offset, 0, 1, chart_dims.pixel_height);
          g.endFill();
        }}
      />
    </>
  );
};

export default CrossHairs;
