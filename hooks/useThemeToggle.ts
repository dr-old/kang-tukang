import { useState, useEffect } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";

export const useThemeToggle = () => {
  const systemColorScheme = useSystemColorScheme(); // Get system color scheme
  const [colorScheme, setColorScheme] = useState(systemColorScheme);

  useEffect(() => {
    setColorScheme(systemColorScheme);
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setColorScheme((prevScheme) => (prevScheme === "dark" ? "light" : "dark"));
  };

  const theme: Theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return {
    colorScheme,
    theme,
    toggleTheme,
  };
};
