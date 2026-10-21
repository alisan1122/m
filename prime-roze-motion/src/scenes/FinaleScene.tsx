import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandMark } from "../components/BrandMark";
import { arabicFont, CREAM, GOLD, GOLD_LIGHT, NAVY, NAVY_DEEP } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const STRIKE_AT = 34; // local frame: the gold line crosses out "كلام وكذب"
export const END_CARD_AT = 70; // local frame: logo + handle

const Handle: React.FC = () => {
  const frame = useCurrentFrame() - END_CARD_AT - 14;
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 13 } });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "14px 38px",
        borderRadius: 999,
        background: `${NAVY}e6`,
        border: `2px solid ${GOLD}`,
        boxShadow: `0 0 30px ${GOLD}66, 0 12px 40px rgba(0,0,0,0.6)`,
        opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
        scale: interpolate(s, [0, 1], [0.6, 1]),
        translate: `0px ${interpolate(s, [0, 1], [40, 0])}px`,
      }}
    >
      <svg
        width={54}
        height={54}
        viewBox="0 0 24 24"
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth={2}
      >
        <rect x={3} y={3} width={18} height={18} rx={5} />
        <circle cx={12} cy={12} r={4.2} />
        <circle cx={17.4} cy={6.6} r={0.6} fill={GOLD_LIGHT} />
      </svg>
      <span
        style={{
          fontFamily: arabicFont,
          fontWeight: 800,
          fontSize: 52,
          color: CREAM,
          direction: "ltr",
        }}
      >
        @prime_rose79
      </span>
    </div>
  );
};

/** "راح تكول كلام وكذب": crossed out in gold, then the end card. */
export const FinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const words = spring({
    frame: frame - 2,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const strike = interpolate(frame, [STRIKE_AT, STRIKE_AT + 8], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.7, 0, 0.3, 1),
  });
  const swap = interpolate(
    frame,
    [END_CARD_AT - 6, END_CARD_AT + 2],
    [0, 1],
    clamp,
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill
        dir="rtl"
        lang="ar"
        style={{
          alignItems: "center",
          paddingTop: 140,
          fontFamily: arabicFont,
        }}
      >
        <div
          style={{
            position: "relative",
            opacity: interpolate(words, [0, 0.3], [0, 1], clamp) * (1 - swap),
            scale: interpolate(words, [0, 1], [0.4, 1]) * (1 - swap * 0.2),
            filter: `blur(${swap * 14}px)`,
          }}
        >
          <div
            style={{
              color: CREAM,
              fontSize: 150,
              fontWeight: 900,
              lineHeight: 1.15,
              textShadow: "0 8px 30px rgba(0,0,0,0.8)",
            }}
          >
            كلام وكذب؟
          </div>
          <div
            style={{
              position: "absolute",
              top: "52%",
              right: -20,
              height: 16,
              width: `calc(${strike * 100}% + ${strike * 40}px)`,
              borderRadius: 8,
              rotate: "-4deg",
              background: `linear-gradient(90deg, #b98a3c, ${GOLD_LIGHT})`,
              boxShadow: `0 0 26px ${GOLD}`,
            }}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: NAVY_DEEP,
          opacity: interpolate(
            frame,
            [durationInFrames - 16, durationInFrames - 2],
            [0, 0.88],
            clamp,
          ),
        }}
      />

      {frame >= END_CARD_AT - 4 ? (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
          <div style={{ scale: 0.82 }}>
            <BrandMark width={700} revealAt={END_CARD_AT - 4} />
          </div>
          <div style={{ marginTop: -30 }}>
            <Handle />
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
