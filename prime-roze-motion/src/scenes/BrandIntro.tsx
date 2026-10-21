import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandMark } from "../components/BrandMark";
import { GOLD, NAVY, NAVY_DEEP } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.76, 0, 0.24, 1);

/** Opens on a navy curtain with the logo, splits open onto the video, logo docks at the top. */
export const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const open = interpolate(frame, [12, 26], [0, 1], { ...clamp, easing: ease });
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [0, 1],
    clamp,
  );

  const panel = (top: boolean): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    right: 0,
    height: 960,
    [top ? "top" : "bottom"]: 0,
    background: `linear-gradient(${top ? 180 : 0}deg, ${NAVY_DEEP}, ${NAVY})`,
    translate: `0px ${(top ? -1 : 1) * open * 980}px`,
    borderBottom: top ? `3px solid ${GOLD}` : undefined,
    borderTop: top ? undefined : `3px solid ${GOLD}`,
    boxShadow: `0 0 40px ${GOLD}66`,
  });

  return (
    <AbsoluteFill>
      <div style={panel(true)} />
      <div style={panel(false)} />
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: interpolate(open, [0, 1], [960 - 240, 150]),
            scale:
              interpolate(open, [0, 1], [1.25, 0.82]) *
              interpolate(exit, [0, 1], [1, 0.9]),
            opacity: 1 - exit,
            filter: `blur(${exit * 12}px)`,
          }}
        >
          <BrandMark width={700} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
