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

export interface AppTheme {
  readonly colors: typeof lightColors;
  readonly fontSize: typeof fontSize;
  readonly fontWeight: typeof fontWeight;
  readonly fontFamily: typeof fontFamily;
  readonly lineHeight: typeof lineHeight;
  readonly letterSpacing: typeof letterSpacing;
  readonly textStyles: typeof textStyles;
  readonly spacing: typeof spacing;
  readonly borderRadius: typeof borderRadius;
  readonly shadows: typeof shadows;
  readonly layout: typeof layout;
  readonly isDark: boolean;
}

export const lightTheme: AppTheme = {
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
};

export const darkTheme: AppTheme = {
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
};
