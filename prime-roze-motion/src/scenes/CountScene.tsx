import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Product } from "../components/Product";
import { arabicFont, CREAM, GOLD, goldText } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const COUNT_LAND = 52; // local frame where the counter hits 500

/** "أكثر من +500 نوع عطر" counter, with the range of bottles flying in on both sides. */
export const CountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const value = Math.round(
    interpolate(frame, [6, COUNT_LAND], [0, 500], {
      ...clamp,
      easing: Easing.bezier(0.2, 0.6, 0.3, 1),
    }),
  );
  const land = spring({
    frame: frame - COUNT_LAND,
    fps,
    config: { damping: 9, stiffness: 160 },
  });
  const head = spring({ frame, fps, config: { damping: 200 } });
  const tail = spring({ frame: frame - 22, fps, config: { damping: 15 } });
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [0, 1],
    clamp,
  );
  const exitAt = durationInFrames - 10;

  return (
    <AbsoluteFill>
      <Product
        src="products/bottle-amber.png"
        side="left"
        x={0}
        y={760}
        height={400}
        enterAt={8}
        exitAt={exitAt}
        tilt={-8}
      />
      <Product
        src="products/bottle-guilty.png"
        side="left"
        x={20}
        y={1140}
        height={290}
        enterAt={14}
        exitAt={exitAt}
        tilt={10}
      />
      <Product
        src="products/bottle-navy.png"
        side="right"
        x={-30}
        y={770}
        height={330}
        enterAt={11}
        exitAt={exitAt}
        tilt={8}
      />
      <Product
        src="products/bottle-grey.png"
        side="right"
        x={20}
        y={1110}
        height={340}
        enterAt={17}
        exitAt={exitAt}
        tilt={-10}
      />

      <AbsoluteFill
        dir="rtl"
        lang="ar"
        style={{
          alignItems: "center",
          paddingTop: 70,
          fontFamily: arabicFont,
          opacity: 1 - exit,
          scale: 1 - exit * 0.15,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: CREAM,
            opacity: head,
            translate: `0px ${interpolate(head, [0, 1], [-40, 0])}px`,
          }}
        >
          أكثر من
        </div>
        <div
          style={{
            ...goldText,
            direction: "ltr",
            fontSize: 250,
            fontWeight: 900,
            lineHeight: 1,
            marginTop: -10,
            scale: 1 + interpolate(land, [0, 0.5, 1], [0, 0.18, 0]),
            fontVariantNumeric: "tabular-nums",
          }}
        >
          +{value}
        </div>
        <div
          style={{
            marginTop: 6,
            padding: "4px 44px 12px",
            borderRadius: 999,
            background: `linear-gradient(90deg, #b98a3c, ${GOLD}, #b98a3c)`,
            color: "#0d1330",
            fontSize: 64,
            fontWeight: 900,
            opacity: tail,
            scale: interpolate(tail, [0, 1], [0.5, 1]),
            boxShadow: `0 10px 40px rgba(0,0,0,0.6), 0 0 30px ${GOLD}88`,
          }}
        >
          نوع عطر
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
