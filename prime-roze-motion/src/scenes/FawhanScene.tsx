import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
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
export const RING_IN = 68; // local frame: "من 4 ساعات"
export const FLIP_TO_5 = 122; // local frame: "إلى 5 ساعات"

/** Scent waves rising behind the headline. */
const ScentWaves: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={1080}
      height={520}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {[0, 1, 2, 3].map((i) => {
        const p = ((frame + i * 14) % 56) / 56;
        return (
          <ellipse
            key={i}
            cx={540}
            cy={250}
            rx={160 + p * 420}
            ry={60 + p * 150}
            fill="none"
            stroke={GOLD}
            strokeWidth={4 - p * 3}
            opacity={(1 - p) * 0.55}
          />
        );
      })}
    </svg>
  );
};

/** Mist particles drifting out of the bottle's nozzle. */
const Mist: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(36).fill(0).map((_, i) => {
        const life = ((frame * 1.2 + random(`m${i}`) * 60) % 60) / 60;
        const angle = (random(`a${i}`) - 0.5) * 0.9;
        const dist = life * (220 + random(`d${i}`) * 260);
        const size = 6 + life * 40 * random(`z${i}`);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(angle) * dist,
              top: y + Math.sin(angle) * dist - life * 120,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 4 ? `${GOLD_LIGHT}` : "#ffffff",
              filter: `blur(${2 + life * 8}px)`,
              opacity: (1 - life) * 0.55,
            }}
          />
        );
      })}
    </>
  );
};

const HourRing: React.FC = () => {
  const frame = useCurrentFrame() - RING_IN;
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12 } });
  const flip = spring({
    frame: frame - (FLIP_TO_5 - RING_IN),
    fps,
    config: { damping: 11 },
  });
  const hours = frame >= FLIP_TO_5 - RING_IN ? 5 : 4;
  const progress = interpolate(
    frame,
    [0, 30, FLIP_TO_5 - RING_IN, FLIP_TO_5 - RING_IN + 20],
    [0, 4 / 6, 4 / 6, 5 / 6],
    {
      ...clamp,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
  const R = 112;
  const C = 2 * Math.PI * R;
  return (
    <div
      style={{
        position: "absolute",
        right: 34,
        top: 760,
        width: 280,
        height: 280,
        opacity: interpolate(pop, [0, 0.3], [0, 1], clamp),
        scale: interpolate(pop, [0, 1], [0.3, 1]),
        rotate: `${interpolate(pop, [0, 1], [-60, 0])}deg`,
      }}
    >
      <svg width={280} height={280} style={{ position: "absolute", inset: 0 }}>
        <circle
          cx={140}
          cy={140}
          r={130}
          fill={`${NAVY_DEEP}e0`}
          stroke={`${GOLD}55`}
          strokeWidth={2}
        />
        <circle
          cx={140}
          cy={140}
          r={R}
          fill="none"
          stroke={`${GOLD}30`}
          strokeWidth={14}
        />
        <circle
          cx={140}
          cy={140}
          r={R}
          fill="none"
          stroke={GOLD}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={`${C * progress} ${C}`}
          transform="rotate(-90 140 140)"
          style={{ filter: `drop-shadow(0 0 10px ${GOLD})` }}
        />
      </svg>
      <div
        dir="rtl"
        lang="ar"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: arabicFont,
        }}
      >
        <div
          style={{
            ...goldText,
            fontSize: 130,
            fontWeight: 900,
            lineHeight: 0.95,
            scale:
              hours === 5 ? 1 + interpolate(flip, [0, 0.5, 1], [0, 0.3, 0]) : 1,
          }}
        >
          {hours}
        </div>
        <div
          style={{ color: CREAM, fontSize: 40, fontWeight: 800, marginTop: -6 }}
        >
          ساعات
        </div>
      </div>
    </div>
  );
};

/** "الفوحان": scent projection of 4 to 5 hours. */
export const FawhanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const head = spring({
    frame: frame - 2,
    fps,
    config: { damping: 12, stiffness: 140 },
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [0, 1],
    clamp,
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <ScentWaves />
      <Product
        src="products/bottle-navy.png"
        side="left"
        x={-10}
        y={820}
        height={360}
        enterAt={4}
        exitAt={durationInFrames - 10}
        tilt={-6}
      />
      <Mist x={190} y={850} />
      <HourRing />
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
            scale: interpolate(head, [0, 1], [1.8, 1]),
            opacity: interpolate(head, [0, 0.3], [0, 1], clamp),
            filter: `${goldText.filter} blur(${interpolate(head, [0, 0.6], [14, 0], clamp)}px)`,
          }}
        >
          الفوحان
        </div>
        <div
          style={{
            height: 4,
            width: interpolate(frame, [10, 28], [0, 520], {
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
