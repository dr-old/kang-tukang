import React from "react";
import { heightPercentageToDP, widthPercentageToDP } from "@/utils/sizing";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { useAuthRealm } from "@/hooks/useAuth";
import { env } from "@/constants/Constant";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

interface SplashScreenProps {
  signin: boolean;
}

export default function SplashScreen({ signin }: SplashScreenProps) {
  const { user, error, loading } = useAuthRealm(env.APP_KEY_REALM, signin);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.warning} />
        <ThemedText type="normal" font="medium" style={styles.loadingText}>
          Loading...
        </ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText type="normal" font="medium" style={styles.errorText}>
          Error: {error?.message}
        </ThemedText>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/background-logo.png")}
      style={styles.background}
      resizeMode="cover">
      <Image
        source={require("@/assets/images/watermark.png")}
        style={styles.watermark}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  button: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    marginHorizontal: 60,
    gap: 14,
  },
  watermark: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(100),
    position: "absolute",
  },
  reactLogo: {
    height: 65,
    width: widthPercentageToDP(100),
    resizeMode: "contain",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});
