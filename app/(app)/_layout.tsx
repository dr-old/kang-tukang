import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(root)",
};

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen
        name="sign-in"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
