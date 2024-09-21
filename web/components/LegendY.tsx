import { Graphics, Text } from "@pixi/react";
import { TextStyle } from "@pixi/text";
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
                g.moveTo(0, spacingY * (i + 1) + 10);
                g.lineTo(width, spacingY * (i + 1) + 10);
                g.endFill();
              }}
            />
            {/* text */}
            <Text
              text={rupeesAt(spacingY * i + 16)}
              x={40}
              y={spacingY * i + 16}
              style={new TextStyle({ fontSize: 16 })}
            />
            <Text
              text={rupeesAt(spacingY * i + 16)}
              x={width - 80}
              y={spacingY * i + 16}
              style={new TextStyle({ fontSize: 16 })}
            />
          </>
        ))}
    </>
  );
};

export default LegendY;
