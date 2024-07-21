import { useMemo } from "react";

import { useTheme } from "./use-theme";

export default function useCurrentTheme() {
  const { theme } = useTheme();

  const currentTheme = useMemo(
    () =>
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme,
    [theme, window.matchMedia("(prefers-color-scheme: dark)").matches]
  );

  return currentTheme;
}
