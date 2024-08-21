import { Platform, StyleSheet, View } from "react-native";
import HeaderBack from "./HeaderBack";

const Header = ({ backgroundColor }: { backgroundColor?: string }) => {
  return Platform.OS === "ios" ? (
    <View
      style={{
        ...styles.headerFix,
        backgroundColor: backgroundColor || "transparent",
      }}>
      <HeaderBack />
    </View>
  ) : (
    <View style={styles.headerAndroid}>
      <HeaderBack />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerFix: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 4,
  },
  headerAndroid: {
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 4,
    height: 90,
  },
});
