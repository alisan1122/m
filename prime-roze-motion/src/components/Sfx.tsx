import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";

type Cue = { at: number; sound: string; volume: number };

// Motion sound design only (no music). Times in seconds, matched to the graphics.
const CUES: Cue[] = [
  { at: 0.1, sound: "whoosh", volume: 0.55 },
  { at: 0.55, sound: "shimmer", volume: 0.4 },
  { at: 2.0, sound: "whoosh", volume: 0.5 },
  { at: 2.35, sound: "swish", volume: 0.4 },
  { at: 2.55, sound: "whoosh-back", volume: 0.35 },
  { at: 2.83, sound: "pop", volume: 0.5 },
  { at: 3.83, sound: "impact", volume: 0.6 },
  { at: 3.86, sound: "shimmer", volume: 0.3 },
  { at: 4.78, sound: "whoosh", volume: 0.5 },
  { at: 4.92, sound: "swish", volume: 0.35 },
  { at: 7.12, sound: "pop", volume: 0.55 },
  { at: 8.92, sound: "shimmer", volume: 0.45 },
  { at: 9.92, sound: "whoosh-back", volume: 0.5 },
  { at: 10.04, sound: "impact", volume: 0.35 },
  { at: 11.73, sound: "riser", volume: 0.35 },
  { at: 13.13, sound: "impact", volume: 0.65 },
  { at: 14.38, sound: "whoosh", volume: 0.5 },
  { at: 14.52, sound: "swish", volume: 0.35 },
  { at: 15.58, sound: "swish", volume: 0.5 },
  { at: 16.6, sound: "whoosh-back", volume: 0.45 },
  { at: 16.75, sound: "shimmer", volume: 0.5 },
  { at: 17.25, sound: "pop", volume: 0.5 },
];

// Counter ticks while "+500" counts up.
const TICKS: Cue[] = new Array(15)
  .fill(0)
  .map((_, i) => ({ at: 2.3 + i * 0.1, sound: "tick", volume: 0.22 }));

export const Sfx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {[...CUES, ...TICKS].map((c, i) => (
        <Sequence
          key={i}
          name={`SFX ${c.sound}`}
          from={Math.round(c.at * fps)}
          layout="none"
        >
          <Audio src={staticFile(`sfx/${c.sound}.wav`)} volume={c.volume} />
        </Sequence>
      ))}
    </>
  );
};
