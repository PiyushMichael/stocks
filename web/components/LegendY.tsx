import { Graphics, Text } from "@pixi/react";
import { TextStyle } from "@pixi/text";
import React from "react";

const LegendY = ({
  spacingY,
  count,
  width,
  offset,
  rupeesAt,
}: {
  spacingY: number;
  count: number;
  width: number;
  offset: number;
  rupeesAt: (v: number) => string;
}) => {
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
                g.beginFill("grey");
                g.drawRect(0 - offset, spacingY * (i + 1) + 10, width + offset, 1);
                g.endFill();
              }}
            />
            {/* text */}
            <Text
              text={rupeesAt(spacingY * i + 16)}
              x={10}
              y={spacingY * i + 16}
              style={new TextStyle({ fontSize: 16 })}
            />
            <Text
              text={rupeesAt(spacingY * i + 16)}
              x={width - 80}
              y={spacingY * i + 16}
              style={new TextStyle({ fontSize: 16 })}
            />
            {/* <line
              key={`y-legend-${i}`}
              x1={0}
              x2={width}
              y1={spacingY * (i + 1) + 10}
              y2={spacingY * (i + 1) + 10}
              stroke="grey"
              strokeWidth={0.5}
            />
            <text x={10} y={spacingY * i + 16}>
              {rupeesAt(spacingY * i + 16)}
            </text>
            <text x={width - 80} y={spacingY * i + 16}>
              {rupeesAt(spacingY * i + 16)}
            </text> */}
          </>
        ))}
    </>
  );
};

export default LegendY;
