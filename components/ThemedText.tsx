import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeToggle } from "@/hooks/useThemeToggle";
import { Colors } from "@/constants/Colors";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  textAlign?: "auto" | "justify" | "center" | "left" | "right";
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "normal"
    | "semiSmall"
    | "small";
  font?:
    | "thin"
    | "thinItalic"
    | "extraLight"
    | "extraLightItalic"
    | "light"
    | "lightItalic"
    | "regular"
    | "regularItalic"
    | "medium"
    | "mediumItalic"
    | "semiBold"
    | "semiBoldItalic"
    | "bold"
    | "boldItalic"
    | "extraBold"
    | "extraBoldItalic"
    | "black"
    | "blackItalic";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  textAlign,
  type = "default",
  font = "regular",
  ...rest
}: ThemedTextProps) {
  const { colorScheme } = useThemeToggle();

  const color = Colors[colorScheme ?? "light"].text;

  return (
    <Text
      style={[styles[font], { color, textAlign }, styles[type], style]}
      {...rest}
    />
  );
}

const styles: any = StyleSheet.create({
  small: {
    fontSize: 10,
    lineHeight: 15,
  },
  semiSmall: {
    fontSize: 12,
    lineHeight: 20,
  },
  default: {
    fontSize: 14,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 14,
    lineHeight: 24,
  },
  normal: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 36,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 30,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
    color: "#0a7ea4",
  },
  thin: {
    fontFamily: "Poppins_100Thin",
  },
  thinItalic: {
    fontFamily: "Poppins_100Thin_Italic",
  },
  extraLight: {
    fontFamily: "Poppins_200ExtraLight",
  },
  extraLightItalic: {
    fontFamily: "Poppins_200ExtraLight_Italic",
  },
  light: {
    fontFamily: "Poppins_300Light",
  },
  lightItalic: {
    fontFamily: "Poppins_300Light_Italic",
  },
  regular: {
    fontFamily: "Poppins_400Regular",
  },
  regularItalic: {
    fontFamily: "Poppins_400Regular_Italic",
  },
  medium: {
    fontFamily: "Poppins_500Medium",
  },
  mediumItalic: {
    fontFamily: "Poppins_500Medium_Italic",
  },
  semiBold: {
    fontFamily: "Poppins_600SemiBold",
  },
  semiBoldItalic: {
    fontFamily: "Poppins_600SemiBold_Italic",
  },
  bold: {
    fontFamily: "Poppins_700Bold",
  },
  boldItalic: {
    fontFamily: "Poppins_700Bold_Italic",
  },
  extraBold: {
    fontFamily: "Poppins_800ExtraBold",
  },
  extraBoldItalic: {
    fontFamily: "Poppins_800ExtraBold_Italic",
  },
  black: {
    fontFamily: "Poppins_900Black",
  },
  blackItalic: {
    fontFamily: "Poppins_900Black_Italic",
  },
});
