import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Product } from "../components/Product";
import {
  arabicFont,
  CREAM,
  GOLD,
  GOLD_LIGHT,
  goldText,
  NAVY_DEEP,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const GAUGE_FULL = 94; // local frame where the gauge maxes out

const Gauge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 6, fps, config: { damping: 14 } });
  const fill = interpolate(frame, [12, GAUGE_FULL], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.6, 0, 0.9, 0.6),
  });
  const hit = spring({
    frame: frame - GAUGE_FULL,
    fps,
    config: { damping: 8, stiffness: 170 },
  });
  const full = frame >= GAUGE_FULL;
  const H = 640;
  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        top: 690,
        width: 96,
        height: H + 110,
        translate: `${interpolate(enter, [0, 1], [-260, 0])}px 0px`,
        scale: full ? 1 + interpolate(hit, [0, 0.5, 1], [0, 0.12, 0]) : 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          width: 96,
          height: H,
          borderRadius: 48,
          background: `${NAVY_DEEP}d8`,
          border: `3px solid ${GOLD}aa`,
          overflow: "hidden",
          boxShadow: full
            ? `0 0 ${50 * (1 - hit * 0.5)}px ${GOLD}`
            : "0 10px 40px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            bottom: 8,
            height: (H - 16) * fill,
            borderRadius: 40,
            background: `linear-gradient(0deg, #9c6b22, ${GOLD} 60%, ${GOLD_LIGHT})`,
          }}
        />
        {[0.25, 0.5, 0.75].map((m) => (
          <div
            key={m}
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              top: H * (1 - m),
              height: 3,
              background: `${CREAM}55`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          ...goldText,
          position: "absolute",
          top: H + 14,
          width: 220,
          left: -62,
          textAlign: "center",
          fontFamily: arabicFont,
          fontSize: 62,
          fontWeight: 900,
          direction: "ltr",
        }}
      >
        {Math.round(fill * 100)}%
      </div>
    </div>
  );
};

/** "الثباتية": longevity gauge that maxes out with a hit. */
export const ThabatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const stamp = spring({
    frame: frame - 1,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 7, durationInFrames],
    [0, 1],
    clamp,
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Gauge />
      <Product
        src="products/box.png"
        side="right"
        x={-20}
        y={720}
        height={480}
        enterAt={10}
        exitAt={durationInFrames - 10}
        tilt={7}
      />
      <AbsoluteFill
        dir="rtl"
        lang="ar"
        style={{
          alignItems: "center",
          paddingTop: 110,
          fontFamily: arabicFont,
        }}
      >
        <div
          style={{
            ...goldText,
            fontSize: 190,
            fontWeight: 900,
            lineHeight: 1.1,
            scale: interpolate(stamp, [0, 1], [2.6, 1]),
            rotate: `${interpolate(stamp, [0, 1], [-8, 0])}deg`,
            opacity: interpolate(stamp, [0, 0.25], [0, 1], clamp),
          }}
        >
          الثباتية
        </div>
        <div
          style={{
            height: 4,
            width: interpolate(frame, [8, 26], [0, 520], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            marginTop: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD_LIGHT}, transparent)`,
            boxShadow: `0 0 18px ${GOLD}`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
