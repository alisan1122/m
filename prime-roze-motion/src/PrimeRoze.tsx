import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { BaseVideo } from "./components/BaseVideo";
import { GoldDust, Grade, LightSweeps } from "./components/Atmosphere";
import { CAPTIONS, Captions } from "./components/Captions";
import { Sfx } from "./components/Sfx";
import { BrandIntro } from "./scenes/BrandIntro";
import { CountScene } from "./scenes/CountScene";
import { FawhanScene } from "./scenes/FawhanScene";
import { FinaleScene } from "./scenes/FinaleScene";
import { ThabatScene } from "./scenes/ThabatScene";
import { NAVY_DEEP, SEGMENTS } from "./theme";

export const PrimeRoze: React.FC = () => {
  const { fps } = useVideoConfig();
  const span = (s: { from: number; to: number }) => ({
    from: Math.round(s.from * fps),
    durationInFrames: Math.round((s.to - s.from) * fps),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY_DEEP }}>
      <BaseVideo />
      <Grade />
      <LightSweeps />
      <GoldDust />
      <Sequence name="Brand intro" {...span(SEGMENTS.brand)}>
        <BrandIntro />
      </Sequence>
      <Sequence name="+500 perfumes" {...span(SEGMENTS.count)}>
        <CountScene />
      </Sequence>
      <Sequence name="Fawhan 4-5h" {...span(SEGMENTS.fawhan)}>
        <FawhanScene />
      </Sequence>
      <Sequence name="Thabat" {...span(SEGMENTS.thabat)}>
        <ThabatScene />
      </Sequence>
      <Sequence name="Finale" {...span(SEGMENTS.finale)}>
        <FinaleScene />
      </Sequence>
      <Captions chunks={CAPTIONS} />
      <Sfx />
    </AbsoluteFill>
  );
};
