import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [width, setWidth] = useState(
    typeof window === "undefined" ? 0 : window.innerWidth
  );
  const [height, setHeight] = useState(
    typeof window === "undefined" ? 0 : window.innerHeight
  );

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      });
    };
  }, []);

  return { width, height };
};
