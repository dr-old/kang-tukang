import { useThemeColor } from "@/hooks/useThemeColor";
import { responsiveHeight, responsiveWidth } from "@/utils/sizing";
import { Stack, router } from "expo-router";
import { Image, TouchableOpacity } from "react-native";

export default function AuthLayout() {
  const color = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: background,
        },
        headerTitle: "",
        headerTintColor: color,
        headerShadowVisible: false,
        headerLeft(props) {
          return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <Image
                {...props}
                style={{
                  height: responsiveHeight(24),
                  width: responsiveWidth(24),
                }}
                source={require("@/assets/images/Arrow Back.png")}
              />
            </TouchableOpacity>
          );
        },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
