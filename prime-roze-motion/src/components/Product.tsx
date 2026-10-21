import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Props = {
  src: string;
  height: number;
  x: number; // px from the given side
  y: number;
  side: "left" | "right";
  enterAt: number;
  exitAt: number;
  tilt: number;
};

/** A product cut-out that slams in from its side, floats, then flies back out. */
export const Product: React.FC<Props> = ({
  src,
  height,
  x,
  y,
  side,
  enterAt,
  exitAt,
  tilt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inS = spring({
    frame: frame - enterAt,
    fps,
    config: { damping: 13, stiffness: 120 },
  });
  const outP = interpolate(frame, [exitAt, exitAt + 9], [0, 1], clamp);
  const dir = side === "left" ? -1 : 1;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        top: y,
        [side]: x,
        height,
        translate: `${dir * (interpolate(inS, [0, 1], [700, 0]) + outP * outP * 800)}px ${Math.sin((frame + enterAt * 7) / 14) * 10}px`,
        rotate: `${tilt + dir * interpolate(inS, [0, 1], [35, 0]) + Math.sin(frame / 20) * 2}deg`,
        filter:
          "drop-shadow(0 30px 40px rgba(0,0,0,0.75)) drop-shadow(0 0 22px rgba(227,190,110,0.35))",
      }}
    />
  );
};
