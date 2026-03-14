"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { DARK, LIGHT } from "../lib/theme.js";

export const THEME_STORAGE_KEY = "deposit-calc-theme";

const ThemeContext = createContext({
  themeMode: "system",
  setThemeMode: () => {},
  dark: true,
  T: DARK,
});

export function ThemeProvider({ children }) {
  const [themeMode, setThemeModeState] = useState("system");
  const [systemDark, setSystemDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  const dark = themeMode === "system" ? systemDark : themeMode === "dark";
  const T = dark ? DARK : LIGHT;

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    const stored = typeof window !== "undefined" ? localStorage.getItem(THEME_STORAGE_KEY) : null;
    if (stored === "light" || stored === "dark" || stored === "system") setThemeModeState(stored);
  }, [mounted]);
  useEffect(() => {
    if (!mounted || themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const fn = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [mounted, themeMode]);

  const setThemeMode = (mode) => {
    setThemeModeState(mode);
    if (typeof window !== "undefined") localStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, dark, T, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
