import { Redirect, Tabs } from "expo-router";
import React from "react";

import TabBar from "@/components/navigation/TabBar";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { useThemeToggle } from "@/hooks/useThemeToggle";

export default function TabLayout() {
  const { colorScheme } = useThemeToggle();
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
