import { Composition } from "remotion";
import { PrimeRoze } from "./PrimeRoze";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PrimeRoze"
      component={PrimeRoze}
      durationInFrames={580}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
