// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { responsiveHeight, responsiveWidth } from "@/utils/sizing";

export function TabBarIcon({
  style,
  image,
  label,
}: {
  style?: any;
  image?: any;
  label?: string;
}) {
  // return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
  return (
    <View style={styles.tabBar}>
      <Image source={image} style={[styles.tabIcon]} />
      <ThemedText type="semiSmall" font="medium" style={{}}>
        {label}
      </ThemedText>
      <View style={[styles.tabActive, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "red",
  },
  tabIcon: {
    resizeMode: "contain",
    marginTop: 3,
    width: responsiveWidth(20),
    height: responsiveHeight(20),
  },
  tabActive: { height: 4, width: 50, borderRadius: 4 },
});
