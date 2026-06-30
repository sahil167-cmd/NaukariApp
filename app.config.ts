import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Naukari Bazaar",
  slug: "workerconnect",
  version: "1.0.0",
  jsEngine: "hermes",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#FFFFFF"
  },
  userInterfaceStyle: "automatic",
  sdkVersion: "54.0.0",
  ios: {
    supportsTablet: false,
    bundleIdentifier: "in.naukaribazaar.app"
  },
  android: {
    softwareKeyboardLayoutMode: "resize",
    adaptiveIcon: {
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
      backgroundColor: "#D94F4F"
    },
    package: "in.naukaribazaar.app",
    versionCode: 1,
    permissions: [
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.VIBRATE"
    ]
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    [
      "expo-image-picker",
      {
        "photosPermission": "Allow Naukari Bazaar to access your photos for document uploads.",
        "cameraPermission": "Allow Naukari Bazaar to use your camera to take document photos."
      }
    ],
    "expo-font"
  ],
  updates: {
    enabled: false,
    fallbackToCacheTimeout: 0,
    checkAutomatically: "NEVER"
  },
  extra: {
    ...config.extra,
  }
});
