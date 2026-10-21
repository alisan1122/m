import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { arabicFont, CREAM, GOLD_LIGHT, goldText } from "../theme";

type Chunk = { text: string; from: number; to: number; accent?: string[] };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const ChunkLine: React.FC<{ chunk: Chunk }> = ({ chunk }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const words = chunk.text.split(" ");
  const out = interpolate(
    frame,
    [durationInFrames - 5, durationInFrames],
    [1, 0],
    clamp,
  );
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 190,
      }}
    >
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: arabicFont,
          fontWeight: 900,
          fontSize: 72,
          lineHeight: 1.35,
          textAlign: "center",
          maxWidth: 960,
          whiteSpace: "nowrap",
          opacity: out,
          translate: `0px ${interpolate(out, [0, 1], [-24, 0])}px`,
        }}
      >
        {words.map((w, i) => {
          const s = spring({
            frame: frame - i * 3,
            fps,
            config: { damping: 14, stiffness: 180 },
          });
          const accent = chunk.accent?.includes(w);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                margin: "0 8px",
                opacity: interpolate(s, [0, 0.4], [0, 1], clamp),
                scale: interpolate(s, [0, 1], [0.6, 1]),
                translate: `0px ${interpolate(s, [0, 1], [40, 0])}px`,
                ...(accent
                  ? { ...goldText, fontSize: 92 }
                  : {
                      color: CREAM,
                      textShadow: `0 4px 0 rgba(0,0,0,0.55), 0 0 26px rgba(0,0,0,0.8), 0 0 2px ${GOLD_LIGHT}`,
                    }),
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Kinetic captions of the spoken lines, two or so short phrases per paragraph. */
export const Captions: React.FC<{ chunks: Chunk[] }> = ({ chunks }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {chunks.map((c) => (
        <Sequence
          key={c.text}
          name={`Caption: ${c.text}`}
          from={Math.round(c.from * fps)}
          durationInFrames={Math.round((c.to - c.from) * fps)}
        >
          <ChunkLine chunk={c} />
        </Sequence>
      ))}
    </>
  );
};

export const CAPTIONS: Chunk[] = [
  { text: "برايم روز", from: 0.1, to: 2.05, accent: ["برايم", "روز"] },
  { text: "عنده عطور", from: 2.15, to: 3.2 },
  { text: "أكثر من 500 نوع عطر", from: 3.2, to: 4.8, accent: ["500"] },
  { text: "الفوحان مالتها", from: 4.95, to: 7.2, accent: ["الفوحان"] },
  { text: "من 4 ساعات إلى 5 ساعات", from: 7.2, to: 9.95, accent: ["4", "5"] },
  { text: "الثباتية", from: 10.05, to: 11.9, accent: ["الثباتية"] },
  { text: "ما أسولفلك عنها", from: 11.9, to: 14.4 },
  {
    text: "راح تكول كلام وكذب",
    from: 14.55,
    to: 16.8,
    accent: ["كلام", "وكذب"],
  },
  { text: "وباقي العالم وتنشر", from: 16.8, to: 19.0 },
];

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
