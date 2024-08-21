import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { BaseLayout } from "@/components/BaseLayout";
import { ThemedText } from "@/components/ThemedText";
import { UserStoreType } from "@/utils/types";
import { useUserStore } from "@/stores/user/userStore";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeToggle } from "@/hooks/useThemeToggle";

export default function ProfileScreen() {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const { colorScheme } = useThemeToggle();

  const security = [
    {
      title: "Change Password",
      icon: "lock",
      onPress: () => {
        router.push({
          pathname: "/(profile)/update-profile",
          params: { id: 1, title: "Change Password" },
        });
      },
    },
    {
      title: "Change Phone Number",
      icon: "screen-smartphone",
      onPress: () => {
        router.push({
          pathname: "/(profile)/update-profile",
          params: { id: 2, title: "Change Phone Number" },
        });
      },
    },
  ];

  const helpCenter = [
    {
      title: "About Us",
      icon: "exclamationcircleo",
      onPress: () => console.log(),
      library: AntDesign,
    },
    {
      title: "Privacy Policy",
      icon: "shield",
      onPress: () => console.log(),
      library: Octicons,
    },
    {
      title: "Help",
      icon: "chat-question",
      onPress: () => console.log(),
      library: MaterialCommunityIcons,
    },
  ];

  return (
    <BaseLayout
      lightBackgroundColor={Colors.warning}
      darkBackgroundColor={Colors.warning}
      enableScroll={true}
      statusBarStyle="dark-content">
      <View style={styles.header}>
        <ThemedText font="semiBold" type="normal">
          Profile
        </ThemedText>
      </View>
      <View
        style={{
          ...styles.order,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}>
        <View style={styles.orderItem}>
          <Image source={{ uri: profile?.photo }} style={styles.orderImage} />
          <View style={{ flex: 1 }}>
            <ThemedText font="semiBold" type="default">
              {profile?.name || "Your full name"}
            </ThemedText>
            <View style={styles.rowBetween}>
              <ThemedText font="regular" type="semiSmall">
                {`+62 ${profile?.phone}` ?? "Your phone number"}
              </ThemedText>
              <ThemedText
                font="semiBold"
                type="default"
                onPress={() => {
                  router.push({
                    pathname: "/(profile)/update-profile",
                    params: { id: 3, title: "Your Profile" },
                  });
                }}>
                See Profile
              </ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.orderItem}>
          <View
            style={{
              ...styles.orderAddress,
              borderColor: Colors[colorScheme ?? "light"].textYellow,
            }}>
            <ThemedText
              lightColor={Colors[colorScheme ?? "light"].textYellow}
              darkColor={Colors[colorScheme ?? "light"].textYellow}
              font="regular"
              type="semiSmall">
              {profile?.address || "Your address"}
            </ThemedText>
          </View>
        </View>
        <View
          style={{
            ...styles.orderItem,
            ...styles.menu,
          }}>
          <View style={{ flex: 1 }}>
            <ThemedText font="semiBold">Security</ThemedText>
            {security.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                activeOpacity={0.8}
                onPress={item.onPress}
                style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <SimpleLineIcons name={item.icon} size={20} />
                </View>
                <ThemedText font="regular" style={{ flex: 1, marginLeft: 10 }}>
                  {item.title}
                </ThemedText>
                <Ionicons name="chevron-forward" size={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View
          style={{
            ...styles.orderItem,
            ...styles.menu,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
          }}>
          <View style={{ flex: 1 }}>
            <ThemedText font="semiBold">Help Center</ThemedText>
            {helpCenter.map((item, index) => (
              <View key={index.toString()} style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <item.library name={item.icon} size={20} />
                </View>
                <ThemedText font="regular" style={{ flex: 1, marginLeft: 10 }}>
                  {item.title}
                </ThemedText>
                <Ionicons name="chevron-forward" size={20} />
              </View>
            ))}
          </View>
        </View>
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.warning,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    paddingBottom: 70,
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  order: {
    marginTop: -50,
    marginHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 20,
  },
  orderItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  orderImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
    resizeMode: "contain",
    marginRight: 15,
  },
  orderAddress: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 125,
  },
  menu: {
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: Colors.warning,
  },
  menuItem: {
    marginTop: 20,
    marginLeft: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
