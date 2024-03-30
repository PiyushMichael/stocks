import React from "react";
import { ChartDimension } from "./Chart";

const CrossHairs = ({
  x,
  y,
  chart_dims,
}: {
  x: number;
  y: number;
  chart_dims: ChartDimension;
}) => {
  if (x + y === 0) {
    return <></>;
  }

  return (
    <>
      <line
        x1={0}
        y1={y}
        x2={chart_dims.pixel_width}
        y2={y}
        stroke="red"
        strokeWidth={1}
      />
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={chart_dims.pixel_height}
        stroke="red"
        strokeWidth={1}
      />
    </>
  );
};

export default CrossHairs;
