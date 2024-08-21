import React, { ReactNode } from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors"; // Assuming you have a Colors file for theme colors
import { ThemedText } from "./ThemedText";
import { responsiveHeight } from "@/utils/sizing";
import { useThemeToggle } from "@/hooks/useThemeToggle";

interface ThemeButton {
  title: string;
  type?: string;
  onPress: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  mode?: string;
  height?: number;
  ph?: number;
  preffix?: ReactNode;
  style?: ViewStyle;
}

export function ThemedButton({
  title,
  type = "default",
  onPress,
  fullWidth = false,
  disabled,
  mode,
  preffix,
  style,
  height,
  ph,
}: ThemeButton) {
  const { colorScheme } = useThemeToggle();
  return (
    <TouchableOpacity
      style={[
        {
          ...styles.button,
          opacity: disabled ? 0.5 : 1,
          paddingHorizontal: ph || 16,
          height: responsiveHeight(height || 48),
        },
        type === "default"
          ? {
              backgroundColor: Colors.light.background,
            }
          : styles[type],
        style,
        preffix && styles.preffix,
        fullWidth && styles.fullWidthButton, // Apply full width style if true
      ]}
      disabled={disabled}
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
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
  danger: {
    backgroundColor: Colors.danger,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  info: {
    backgroundColor: Colors.info,
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
  infoText: {
    color: Colors.white,
  },
});
