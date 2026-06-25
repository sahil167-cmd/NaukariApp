/**
 * WorkerConnect — Centralized Color Tokens
 * All colors extracted from Stitch design screenshots.
 * Never use raw hex values outside this file.
 */

export const palette = {
  // Brand
  orange50: '#FFF3E8',
  orange100: '#FFD9B3',
  orange200: '#FFBF7F',
  orange300: '#FFA54B',
  orange400: '#FF8C1A',
  orange500: '#E8621A', // Primary CTA
  orange600: '#C44F0E',
  orange700: '#A03C05',

  // Neutrals
  cream50: '#FDFAF7',
  cream100: '#FDF6F0', // App background
  cream200: '#F5EDE4', // Input background
  cream300: '#EDE0D4',
  cream400: '#E0D8D0', // Border
  cream500: '#C8BCAF',

  // Text
  gray900: '#1A1A1A',  // Primary text
  gray800: '#2D2D2D',
  gray700: '#4A4A4A',
  gray600: '#6B6B6B',  // Secondary text
  gray500: '#8E8E8E',
  gray400: '#9E9E9E',  // Muted text
  gray300: '#BDBDBD',
  gray200: '#E0E0E0',
  gray100: '#F5F5F5',
  gray50:  '#FAFAFA',

  // Semantic
  white: '#FFFFFF',
  black: '#000000',

  // Status
  success500: '#2E7D32',
  success100: '#E8F5E9',
  error500: '#C62828',
  error100: '#FFEBEE',
  warning500: '#F57F17',
  warning100: '#FFF8E1',
  info500: '#1565C0',
  info100: '#E3F2FD',

  // Dark theme
  dark900: '#0F0F0F',
  dark800: '#1A1A1A',
  dark700: '#242424',
  dark600: '#2D2D2D',
  dark500: '#3D3D3D',
  dark400: '#4D4D4D',
} as const;

export interface ColorTokens {
  readonly background: string;
  readonly surface: string;
  readonly surfaceVariant: string;
  readonly border: string;
  readonly divider: string;
  readonly primary: string;
  readonly primaryLight: string;
  readonly primaryDark: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly textInverse: string;
  readonly textPlaceholder: string;
  readonly buttonPrimary: string;
  readonly buttonPrimaryText: string;
  readonly buttonSecondary: string;
  readonly buttonSecondaryText: string;
  readonly buttonOutlineText: string;
  readonly buttonOutlineBorder: string;
  readonly inputBackground: string;
  readonly inputBorder: string;
  readonly inputBorderFocused: string;
  readonly inputText: string;
  readonly inputPlaceholder: string;
  readonly inputError: string;
  readonly cardBackground: string;
  readonly cardBorder: string;
  readonly cardShadow: string;
  readonly success: string;
  readonly successBackground: string;
  readonly error: string;
  readonly errorBackground: string;
  readonly warning: string;
  readonly warningBackground: string;
  readonly info: string;
  readonly infoBackground: string;
  readonly tabActive: string;
  readonly tabInactive: string;
  readonly tabBackground: string;
  readonly overlay: string;
  readonly shimmerBase: string;
  readonly shimmerHighlight: string;
}

export const lightColors: ColorTokens = {
  // Layout
  background: palette.cream100,
  surface: palette.white,
  surfaceVariant: palette.cream200,
  border: palette.cream400,
  divider: palette.cream300,

  // Brand
  primary: palette.orange500,
  primaryLight: palette.orange50,
  primaryDark: palette.orange600,

  // Text
  textPrimary: palette.gray900,
  textSecondary: palette.gray600,
  textMuted: palette.gray400,
  textInverse: palette.white,
  textPlaceholder: palette.gray300,

  // Interactive
  buttonPrimary: palette.orange500,
  buttonPrimaryText: palette.white,
  buttonSecondary: palette.cream300,
  buttonSecondaryText: palette.gray900,
  buttonOutlineText: palette.gray900,
  buttonOutlineBorder: palette.cream400,

  // Input
  inputBackground: palette.cream200,
  inputBorder: palette.cream400,
  inputBorderFocused: palette.orange500,
  inputText: palette.gray900,
  inputPlaceholder: palette.gray400,
  inputError: palette.error500,

  // Card
  cardBackground: palette.white,
  cardBorder: palette.cream400,
  cardShadow: 'rgba(0,0,0,0.06)',

  // Status
  success: palette.success500,
  successBackground: palette.success100,
  error: palette.error500,
  errorBackground: palette.error100,
  warning: palette.warning500,
  warningBackground: palette.warning100,
  info: palette.info500,
  infoBackground: palette.info100,

  // Navigation
  tabActive: palette.orange500,
  tabInactive: palette.gray400,
  tabBackground: palette.white,

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
  shimmerBase: palette.cream300,
  shimmerHighlight: palette.cream100,
};

export const darkColors: ColorTokens = {
  background: palette.dark900,
  surface: palette.dark800,
  surfaceVariant: palette.dark700,
  border: palette.dark500,
  divider: palette.dark600,

  primary: palette.orange400,
  primaryLight: 'rgba(232,98,26,0.15)',
  primaryDark: palette.orange500,

  textPrimary: '#F5F5F5',
  textSecondary: '#BDBDBD',
  textMuted: '#8E8E8E',
  textInverse: palette.black,
  textPlaceholder: palette.gray500,

  buttonPrimary: palette.orange400,
  buttonPrimaryText: palette.white,
  buttonSecondary: palette.dark600,
  buttonSecondaryText: '#F5F5F5',
  buttonOutlineText: '#F5F5F5',
  buttonOutlineBorder: palette.dark500,

  inputBackground: palette.dark700,
  inputBorder: palette.dark500,
  inputBorderFocused: palette.orange400,
  inputText: '#F5F5F5',
  inputPlaceholder: palette.gray500,
  inputError: '#EF9A9A',

  cardBackground: palette.dark800,
  cardBorder: palette.dark600,
  cardShadow: 'rgba(0,0,0,0.3)',

  success: '#66BB6A',
  successBackground: 'rgba(46,125,50,0.15)',
  error: '#EF9A9A',
  errorBackground: 'rgba(198,40,40,0.15)',
  warning: '#FFB74D',
  warningBackground: 'rgba(245,127,23,0.15)',
  info: '#64B5F6',
  infoBackground: 'rgba(21,101,192,0.15)',

  tabActive: palette.orange400,
  tabInactive: palette.gray500,
  tabBackground: palette.dark800,

  overlay: 'rgba(0,0,0,0.7)',
  shimmerBase: palette.dark600,
  shimmerHighlight: palette.dark500,
};
