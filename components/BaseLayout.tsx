import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  ViewStyle,
  ScrollView,
  Platform,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { heightPercentageToDP, widthPercentageToDP } from "@/utils/sizing";
import { ThemedView } from "./ThemedView";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import Divider from "./Divider";

type BaseLayoutProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  statusBarStyle?: "light-content" | "dark-content";
  showWatermark?: boolean;
  enableScroll?: boolean;
  enableHeader?: boolean;
};

export function BaseLayout({
  children,
  style,
  lightBackgroundColor,
  darkBackgroundColor,
  statusBarStyle,
  showWatermark = false,
  enableScroll = false,
  enableHeader = false,
}: BaseLayoutProps) {
  const backgroundColor = useThemeColor(
    { light: lightBackgroundColor, dark: darkBackgroundColor },
    "background"
  );
  const { colorScheme } = useThemeToggle();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle={"dark-content"} />
      {Platform.OS === "android" && enableHeader && <Divider height={50} />}
      <ThemedView style={{ flex: 1 }}>
        {enableScroll ? (
          <ScrollView contentContainerStyle={[{ flexGrow: 1 }, style]}>
            {children}
            <Divider height={50} />
          </ScrollView>
        ) : (
          <ThemedView style={[{ flex: 1 }, style]}>{children}</ThemedView>
        )}
        {showWatermark && (
          <Image
            source={require("@/assets/images/watermark.png")}
            style={styles.watermark}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  watermark: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(100),
    position: "absolute",
  },
});
