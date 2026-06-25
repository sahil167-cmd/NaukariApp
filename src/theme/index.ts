/**
 * WorkerConnect — Theme Index
 * Exports the unified theme object.
 */

export { lightColors, darkColors, palette } from './colors';
export type { ColorTokens } from './colors';
export { fontSize, fontWeight, fontFamily, lineHeight, letterSpacing, textStyles } from './typography';
export { spacing, borderRadius, shadows, layout } from './spacing';

import { lightColors, darkColors } from './colors';
import { fontSize, fontWeight, fontFamily, lineHeight, letterSpacing, textStyles } from './typography';
import { spacing, borderRadius, shadows, layout } from './spacing';

export const lightTheme = {
  colors: lightColors,
  fontSize,
  fontWeight,
  fontFamily,
  lineHeight,
  letterSpacing,
  textStyles,
  spacing,
  borderRadius,
  shadows,
  layout,
  isDark: false,
} as const;

export const darkTheme = {
  colors: darkColors,
  fontSize,
  fontWeight,
  fontFamily,
  lineHeight,
  letterSpacing,
  textStyles,
  spacing,
  borderRadius,
  shadows,
  layout,
  isDark: true,
} as const;

export type AppTheme = typeof lightTheme;
