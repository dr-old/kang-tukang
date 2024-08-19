/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  primary: "#1E232C",
  success: "#28a745",
  default: "#6c757d",
  danger: "#dc3545",
  warning: "#EABB48",
  white: "#ffffff",
  info: "#2421A2",
  black: "#000000",
  orange: "#E37437",
  border: "#CCCCCC",
  borderYellow: "#FBCF63",
  light: {
    border: "#CCCCCC",
    input: "#F5F4F6",
    textYellow: "#F4AD5E",
    text: "#0F0F0F",
    background: "#F9F7F0",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    border: "#CCCCCC",
    input: "#F5F4F6",
    textYellow: "#F4AD5E",
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
