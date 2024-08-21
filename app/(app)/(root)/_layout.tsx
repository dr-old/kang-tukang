import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { isLoggedIn, setLogIn } = useUserStore() as unknown as UserStoreType;

  if (!isLoggedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/auth" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
