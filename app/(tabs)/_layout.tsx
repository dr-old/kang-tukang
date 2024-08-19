import { Redirect, Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import TabBar from "@/components/navigation/TabBar";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { profile, isLoggedIn } = useUserStore() as unknown as UserStoreType;

  if (!isLoggedIn && !profile?._id) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      tabBar={(props) => {
        return <TabBar {...props} />;
      }}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="(order)"
        options={{
          title: "Orders",
        }}
      />
      <Tabs.Screen
        name="(message)"
        options={{
          title: "Messages",
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
