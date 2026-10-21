import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts ship in public/fonts (from @fontsource) so renders never depend on the network.
export const arabicFont = "Cairo";
export const scriptFont = "Great Vibes";

const ARABIC_RANGE =
  "U+0600-06FF, U+0750-077F, U+0870-08FF, U+FB50-FDFF, U+FE70-FEFF, U+200C-200E";
for (const weight of ["600", "800", "900"]) {
  loadFont({
    family: arabicFont,
    weight,
    url: staticFile(`fonts/cairo-arabic-${weight}-normal.woff2`),
    unicodeRange: ARABIC_RANGE,
  });
  loadFont({
    family: arabicFont,
    weight,
    url: staticFile(`fonts/cairo-latin-${weight}-normal.woff2`),
    unicodeRange: "U+0000-00FF, U+2000-206F",
  });
}
loadFont({
  family: scriptFont,
  weight: "400",
  url: staticFile("fonts/great-vibes-latin-400-normal.woff2"),
});

// Brand palette sampled from the Prime Roze packaging: deep navy tube, gold foil logo.
export const NAVY = "#0d1330";
export const NAVY_DEEP = "#070a1c";
export const GOLD = "#e3be6e";
export const GOLD_LIGHT = "#fbe7ae";
export const CREAM = "#f6efe0";

export const goldText: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, #e8c477 45%, #b98a3c 70%, #f3d58f 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.65))",
};

// Paragraph boundaries in seconds, aligned to the pauses in the voice track.
export const SEGMENTS = {
  brand: { from: 0, to: 2.1 },
  count: { from: 2.1, to: 4.85 },
  fawhan: { from: 4.85, to: 10.0 },
  thabat: { from: 10.0, to: 14.45 },
  finale: { from: 14.45, to: 19.36 },
} as const;
