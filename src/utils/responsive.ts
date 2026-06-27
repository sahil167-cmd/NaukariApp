/**
 * WorkerConnect — Responsive Design Utilities
 * Phase 4: Device Compatibility & Responsive Layout System
 *
 * Covers:
 *  - Screen size detection (small / medium / large / tablet / foldable)
 *  - Adaptive font scaling (respects Android Font Size accessibility setting)
 *  - Safe minimum touch target sizes (48dp minimum per Material Design)
 *  - Adaptive spacing / padding for different screen widths
 *  - Landscape / Portrait detection
 */

import { Dimensions, Platform, PixelRatio, StatusBar } from "react-native";

// ─── Base reference dimensions (Pixel 4 @ 360dp) ────────────────────────────
const BASE_WIDTH = 360;
const BASE_HEIGHT = 800;

// ─── Live screen metrics ─────────────────────────────────────────────────────
export const getScreen = () => {
  const { width, height } = Dimensions.get("window");
  return { width, height };
};

export const getWindowDimensions = () => Dimensions.get("window");
export const getScreenDimensions = () => Dimensions.get("screen");

// ─── Device category detection ───────────────────────────────────────────────

/** Returns the logical (dp) width of the current window. */
export const screenWidth = () => Dimensions.get("window").width;
export const screenHeight = () => Dimensions.get("window").height;

export const isSmallPhone = () => screenWidth() < 360; // e.g. 320dp
export const isMediumPhone = () => screenWidth() >= 360 && screenWidth() < 411;
export const isLargePhone = () => screenWidth() >= 411 && screenWidth() < 600;
export const isTablet = () => screenWidth() >= 600;
export const isFoldable = () => screenWidth() >= 480 && screenWidth() < 600;
export const isLandscape = () => screenWidth() > screenHeight();
export const isPortrait = () => screenWidth() <= screenHeight();

// ─── Adaptive scale helpers ──────────────────────────────────────────────────

/**
 * Scales a size value proportionally to the screen width.
 * Use for widths, margins, paddings.
 */
export const scale = (size: number): number => {
  const { width } = Dimensions.get("window");
  return (width / BASE_WIDTH) * size;
};

/**
 * Scales a size value proportionally to the screen height.
 * Use for heights, vertical spacing.
 */
export const verticalScale = (size: number): number => {
  const { height } = Dimensions.get("window");
  return (height / BASE_HEIGHT) * size;
};

/**
 * Moderately scales a value — good for font sizes.
 * factor: 0 = no scaling, 1 = full scaling. Default 0.35 keeps text readable.
 */
export const moderateScale = (size: number, factor = 0.35): number => {
  return size + (scale(size) - size) * factor;
};

// ─── Font Scaling ─────────────────────────────────────────────────────────────

/**
 * Returns true when the user has increased the Android system font size.
 * Used to apply layout adjustments that prevent text overflow.
 */
export const isLargeFontScale = () => PixelRatio.getFontScale() > 1.15;
export const fontScaleFactor = () => PixelRatio.getFontScale();

/**
 * Clamps a font size so it never grows beyond maxSp dp when the user has
 * set a large system font. This prevents text overflow in tight containers.
 */
export const clampedFontSize = (base: number, maxSp?: number): number => {
  const scaled = base * PixelRatio.getFontScale();
  return maxSp ? Math.min(scaled, maxSp) : scaled;
};

// ─── Touch Target Guard ───────────────────────────────────────────────────────

/**
 * Material Design minimum touch target is 48dp.
 * Use this when defining interactive element sizes.
 */
export const MIN_TOUCH_SIZE = 48;

/** Returns the larger of the given size or 48dp (min touch target). */
export const touchSafe = (size: number): number =>
  Math.max(size, MIN_TOUCH_SIZE);

// ─── Safe-area-aware bottom padding ──────────────────────────────────────────

/**
 * Estimates the bottom safe area inset for devices that don't use
 * react-native-safe-area-context (e.g., in unit tests or Storybook).
 * Use useSafeAreaInsets() in production components instead.
 */
export const estimatedBottomInset = (): number => {
  // Gesture navigation bar on Android 10+ is typically 0dp (transparent)
  // Home indicator on older devices is usually 0 on Android
  return 0;
};

// ─── Responsive padding helper ────────────────────────────────────────────────

/**
 * Returns a horizontal padding value scaled to the current screen width.
 * - Small phones  (<360dp): 14
 * - Medium phones (360-410): 20
 * - Large phones  (411-599): 24
 * - Tablets       (≥600dp): 32
 */
export const responsiveHorizontalPadding = (): number => {
  const w = screenWidth();
  if (w < 360) return 14;
  if (w < 411) return 20;
  if (w < 600) return 24;
  return 32;
};

/**
 * Returns a max content width so layouts don't stretch unreasonably on tablets.
 * On phones, returns the full screen width.
 */
export const contentMaxWidth = (): number => {
  const w = screenWidth();
  return isTablet() ? Math.min(w, 600) : w;
};

// ─── Utility: is device a specific Android version ───────────────────────────
// Note: Platform.Version is an integer on Android (API level)
export const androidApiLevel = (): number => {
  if (Platform.OS !== "android") return 0;
  return typeof Platform.Version === "number" ? Platform.Version : 0;
};

export const isAndroid10Plus = () => androidApiLevel() >= 29;
export const isAndroid12Plus = () => androidApiLevel() >= 31;
export const isAndroid14Plus = () => androidApiLevel() >= 34;

// ─── Keyboard-related helpers ─────────────────────────────────────────────────

/**
 * Returns the KeyboardAvoidingView behavior appropriate for the OS.
 * On Android, 'height' mode is usually correct; on iOS, 'padding'.
 */
export const keyboardBehavior = ():
  | "height"
  | "padding"
  | "position"
  | undefined => (Platform.OS === "ios" ? "padding" : "height");

// ─── Status bar height ────────────────────────────────────────────────────────

export const statusBarHeight = (): number => {
  if (Platform.OS === "android") {
    return StatusBar.currentHeight ?? 24;
  }
  return 44; // typical iOS safe area
};
