/**
 * WorkerConnect — Theme Context
 * Provides the active theme object to the entire component tree.
 */

import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme, type AppTheme } from "../theme";
import { useSettingsStore } from "../store/settingsStore";

interface ThemeContextValue {
  theme: AppTheme;
  colors: AppTheme["colors"];
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  colors: lightTheme.colors,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const { themeMode, setThemeMode } = useSettingsStore();

  const isDark = useMemo(() => {
    if (themeMode === "system") return systemColorScheme === "dark";
    return themeMode === "dark";
  }, [themeMode, systemColorScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeMode(isDark ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, colors: theme.colors, isDark, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
