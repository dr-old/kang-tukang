import React, { ReactNode } from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors"; // Assuming you have a Colors file for theme colors
import { ThemedText } from "./ThemedText";
import { responsiveHeight } from "@/utils/sizing";

interface ThemeButton {
  title: string;
  type?: string;
  onPress: () => void;
  fullWidth?: boolean;
  mode?: string;
  preffix?: ReactNode;
  style?: ViewStyle;
}

export function ThemedButton({
  title,
  type = "default",
  onPress,
  fullWidth = false,
  mode,
  preffix,
  style,
}: ThemeButton) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[type],
        style,
        preffix && styles.preffix,
        fullWidth && styles.fullWidthButton, // Apply full width style if true
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      {preffix}
      <ThemedText
        font={mode === "sosmed" ? "regular" : "medium"}
        style={[styles[`${type}Text`]]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles: any = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: responsiveHeight(48),
  },
  preffix: { flexDirection: "row", gap: 10 },
  // Full Width Style
  fullWidthButton: {
    width: "100%", // Makes the button full width
  },
  // Button Styles
  primary: {
    backgroundColor: Colors.primary,
  },
  success: {
    backgroundColor: Colors.success,
  },
  default: {
    backgroundColor: Colors.white,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  // Text Colors
  primaryText: {
    color: Colors.light.textYellow,
  },
  successText: {
    color: Colors.white,
  },
  defaultText: {
    color: Colors.black,
  },
  dangerText: {
    color: Colors.white,
  },
  warningText: {
    color: Colors.black,
  },
});
