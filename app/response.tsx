import { heightPercentageToDP, widthPercentageToDP } from "@/utils/sizing";
import { Image, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { ThemedButton } from "@/components/ThemedButton";
import { router, useLocalSearchParams } from "expo-router";

type NavParams = {
  navTo?: string;
  title?: string;
};

export default function ResponseScreen() {
  const { navTo } = useLocalSearchParams<NavParams>();

  return (
    <ThemedView
      lightColor={Colors.warning}
      darkColor={Colors.warning}
      style={styles.background}>
      <Image
        source={require("@/assets/images/Icon Sukses.png")}
        style={styles.reactLogo}
      />
      <ThemedButton
        title="Back"
        type="primary"
        onPress={() => router.replace({ pathname: navTo, params: {} })}
        style={{ marginTop: 20 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    height: 300,
    width: widthPercentageToDP(100),
    resizeMode: "contain",
  },
});
