import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GOLD, GOLD_LIGHT, NAVY_DEEP, SEGMENTS } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Navy grade: darkens the busy newspaper edges so the graphics read cleanly. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${NAVY_DEEP}f2 0%, ${NAVY_DEEP}b0 20%, transparent 36%, transparent 70%, ${NAVY_DEEP}c8 84%, ${NAVY_DEEP}f5 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 75% 55% at 50% 52%, transparent 50%, rgba(4,6,18,0.6) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        background: "#2a1d06",
        mixBlendMode: "soft-light",
        opacity: 0.3,
      }}
    />
  </AbsoluteFill>
);

/** Gold dust drifting upward over the whole piece. */
export const GoldDust: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {new Array(46).fill(0).map((_, i) => {
        const x = random(`x${i}`) * width;
        const speed = 0.6 + random(`s${i}`) * 1.6;
        const y =
          (random(`y${i}`) * height - frame * speed * 3 + height * 4) %
          (height + 60);
        const size = 2 + random(`r${i}`) * 6;
        const twinkle =
          0.35 +
          0.65 * Math.abs(Math.sin(frame / (6 + random(`t${i}`) * 10) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame / 25 + i) * 18,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 3 ? GOLD : GOLD_LIGHT,
              boxShadow: `0 0 ${size * 3}px ${GOLD}`,
              opacity: twinkle * 0.7,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const SWEEPS = [
  SEGMENTS.count.from,
  SEGMENTS.fawhan.from,
  SEGMENTS.thabat.from,
  SEGMENTS.finale.from,
];

/** A diagonal band of gold light plus a short flash at every paragraph change. */
export const LightSweeps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {SWEEPS.map((at) => (
        <AbsoluteFill key={at}>
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at 50% 45%, ${GOLD_LIGHT} 0%, ${GOLD}88 30%, transparent 70%)`,
              opacity: interpolate(
                t,
                [at - 0.04, at + 0.02, at + 0.28],
                [0, 0.85, 0],
                clamp,
              ),
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -400,
              left: 0,
              width: 520,
              height: 2800,
              rotate: "24deg",
              background: `linear-gradient(90deg, transparent, ${GOLD}66, ${GOLD_LIGHT}cc, ${GOLD}66, transparent)`,
              filter: "blur(30px)",
              translate: `${interpolate(
                t,
                [at - 0.1, at + 0.55],
                [-900, 1500],
                {
                  ...clamp,
                  easing: Easing.bezier(0.45, 0, 0.2, 1),
                },
              )}px 0px`,
              opacity: interpolate(
                t,
                [at - 0.1, at, at + 0.45, at + 0.55],
                [0, 1, 1, 0],
                clamp,
              ),
            }}
          />
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
