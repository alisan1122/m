import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SEGMENTS } from "../theme";

// Each new paragraph punches the picture in, then lets it settle.
const PUNCHES = [
  SEGMENTS.count.from,
  SEGMENTS.fawhan.from,
  SEGMENTS.thabat.from,
  SEGMENTS.finale.from,
];
// Seconds where a hit lands hard enough to shake the frame.
export const SHAKES = [3.83, 13.13];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const BaseVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  const punch = PUNCHES.reduce(
    (acc, at) =>
      acc +
      interpolate(t, [at - 0.05, at + 0.06, at + 0.7], [0, 0.08, 0], {
        ...clamp,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    0,
  );
  const shake = SHAKES.reduce(
    (acc, at) =>
      acc + interpolate(t, [at, at + 0.45], [22, 0], clamp) * (t >= at ? 1 : 0),
    0,
  );

  return (
    <AbsoluteFill
      style={{
        scale: interpolate(frame, [0, durationInFrames], [1.16, 1.24]) + punch,
        translate: `${Math.sin(frame * 2.7) * shake}px ${Math.cos(frame * 3.1) * shake}px`,
      }}
    >
      <Video
        src={staticFile("video-graded.mp4")}
        objectFit="cover"
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};
