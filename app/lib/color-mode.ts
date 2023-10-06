const colorModes = ['light', 'dark'] as const;

export type ColorMode = (typeof colorModes)[number];

export function isColorMode(value: unknown): value is ColorMode {
  return (
    typeof value === 'string' &&
    colorModes.includes(value as ColorMode)
  );
}
