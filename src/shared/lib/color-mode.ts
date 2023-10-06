const colorModes = ['light', 'dark'] as const;
const colorModesSet = new Set(colorModes);

export type ColorMode = (typeof colorModes)[number];

export function isColorMode(value: unknown): value is ColorMode {
  return (
    typeof value === 'string' && colorModesSet.has(value as ColorMode)
  );
}
