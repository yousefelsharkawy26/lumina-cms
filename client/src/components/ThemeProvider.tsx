import React, { useEffect, useState } from "react";
import { type Theme, ThemeProviderContext } from "./theme-context";
import { useSettingsStore } from "../store/useSettingsStore";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export default function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const { settings } = useSettingsStore();
  const [localTheme, setLocalTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  // Server-side forced theme takes precedence over local preferences unless it's "system"
  const effectiveTheme = settings?.theme && settings.theme !== "system" 
    ? (settings.theme as Theme) 
    : localTheme;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (effectiveTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  const value = {
    theme: effectiveTheme,
    setTheme: (t: Theme) => {
      localStorage.setItem(storageKey, t);
      setLocalTheme(t);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
