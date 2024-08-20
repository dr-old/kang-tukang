import React, { ReactNode } from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/Colors"; // Adjust the path as needed
import { ThemedText } from "./ThemedText";

interface ThemedBadgeProps {
  title: string;
  type?: "default" | "primary" | "success" | "danger" | "warning" | "info";
  preffix?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  alignSelf?: "flex-start" | "flex-end" | "center";
}

export function ThemedBadge({
  title,
  type = "default",
  preffix,
  style,
  textStyle,
  alignSelf = "flex-start",
}: ThemedBadgeProps) {
  const colorScheme = useColorScheme();
  return (
    <View
      style={[
        styles.badge,
        { alignSelf },
        type === "default"
          ? {
              backgroundColor: Colors[colorScheme ?? "light"].background,
            }
          : styles[type],
        style,
      ]}>
      {preffix}
      <ThemedText
        font={"medium"}
        type="semiSmall"
        style={[styles[`${type}Text`], textStyle]}>
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  preffix: { flexDirection: "row", gap: 10 },
  // Badge Styles
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
    color: Colors.white,
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
