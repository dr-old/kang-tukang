import { ThemedButton } from "@/components/ThemedButton";
import { heightPercentageToDP, widthPercentageToDP } from "@/utils/sizing";
import { router } from "expo-router";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
// import * as Crypto from "expo-crypto";

export default function AuthScreen() {
  return (
    <ImageBackground
      source={require("@/assets/images/background.png")}
      style={styles.background}
      resizeMode="cover">
      <Image
        source={require("@/assets/images/watermark.png")}
        style={styles.watermark}
      />
      <Image
        source={require("@/assets/images/Logo.png")}
        style={styles.reactLogo}
      />
      <View style={styles.button}>
        <ThemedButton
          title="Log In"
          type="primary"
          onPress={() => router.push("/(auth)")}
          fullWidth={true}
        />
        <ThemedButton
          title="Sign Up"
          onPress={() => router.push("/(auth)/register")}
          fullWidth={true}
        />
      </View>
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
});
