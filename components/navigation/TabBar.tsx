import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ThemedText } from "../ThemedText";
import { imageTabBar } from "@/constants/Constant";
import { responsiveHeight, responsiveWidth } from "@/utils/sizing";

const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.tabBar]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}>
            <Image source={imageTabBar[index]} style={[styles.tabImage]} />
            <ThemedText
              type="semiSmall"
              font="medium"
              style={{ color: Colors.black }}>
              {options.title || route.name}
            </ThemedText>
            <View
              style={[
                styles.tabActive,
                { backgroundColor: isFocused ? Colors.black : "transparent" },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 80,
    backgroundColor: Colors.warning,
    paddingBottom: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: Colors.warning,
  },
  tabImage: {
    resizeMode: "contain",
    marginTop: 3,
    width: responsiveWidth(20),
    height: responsiveHeight(20),
  },
  tabActive: { height: 4, width: 40, borderRadius: 4 },
});

export default TabBar;
