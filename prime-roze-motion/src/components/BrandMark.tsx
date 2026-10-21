import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { goldText, scriptFont } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * The Prime Roze lock-up: the gold crescent bottle emblem from the logo
 * with the script word-mark written across it, as on the gift tube.
 * `revealAt` is the local frame where the emblem starts drawing on.
 */
export const BrandMark: React.FC<{ width: number; revealAt?: number }> = ({
  width,
  revealAt = 0,
}) => {
  const frame = useCurrentFrame() - revealAt;
  const height = width * (971 / 1434);
  return (
    <div style={{ position: "relative", width, height }}>
      <Img
        src={staticFile("logo-line.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          clipPath: `circle(${interpolate(frame, [0, 18], [0, 75], clamp)}% at 22% 55%)`,
          filter:
            "drop-shadow(0 0 18px rgba(227,190,110,0.55)) brightness(1.4)",
        }}
      />
      <div
        style={{
          ...goldText,
          position: "absolute",
          left: "14%",
          right: 0,
          top: "30%",
          fontFamily: scriptFont,
          fontSize: width * 0.17,
          lineHeight: 1.1,
          whiteSpace: "nowrap",
          paddingRight: width * 0.04,
          clipPath: `inset(-20% ${interpolate(frame, [6, 26], [100, 0], clamp)}% -20% 0)`,
        }}
      >
        Prime Roze
      </div>
    </div>
  );
};
