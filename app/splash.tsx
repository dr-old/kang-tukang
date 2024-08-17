import { heightPercentageToDP, widthPercentageToDP } from "@/utils/sizing";
import { useCallback, useEffect } from "react";
import Realm from "realm";
import { Image, ImageBackground, StyleSheet } from "react-native";
import { env } from "@/constants/Constant";
import { useApp } from "@realm/react";
import { UserStoreType } from "@/utils/types";
import { useUserStore } from "@/stores/user/userStore";
import { router } from "expo-router";

interface SplashScreenProps {
  signin: boolean;
}

export default function SplashScreen({ signin }: SplashScreenProps) {
  const { isLoggedIn } = useUserStore() as unknown as UserStoreType;
  const app = useApp();

  const signInWithKey = useCallback(async () => {
    const creds = Realm.Credentials.apiKey(env.APP_KEY_REALM);
    const user = await app.logIn(creds);
    console.log("Logged in:", user.id);
  }, [app]);

  const navigateToLogin = async () => {
    const wait = (time: number) =>
      new Promise((resolve) => setTimeout(resolve, time));

    return wait(2000).then(async () => {
      if (signin) await signInWithKey();

      if (isLoggedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)");
      }
    });
  };

  useEffect(() => {
    navigateToLogin();
  });

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
