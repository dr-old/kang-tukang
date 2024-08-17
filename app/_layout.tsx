import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import "expo-dev-client";
import "react-native-get-random-values";
import * as Splash from "expo-splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import { AppProvider, UserProvider, RealmProvider } from "@realm/react";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { env } from "@/constants/Constant";
import { OpenRealmBehaviorType } from "realm";
import { schemas } from "@/schemes";
import SplashScreen from "./splash";
import { LogBox } from "react-native";
import { UserStoreType } from "@/utils/types";
import { useUserStore } from "@/stores/user/userStore";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const DashStack = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="response" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
};

const AuthStack = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="response" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  const { isLoggedIn, profile } = useUserStore() as unknown as UserStoreType;
  const colorScheme = useColorScheme();
  let [loaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  useEffect(() => {
    if (loaded) {
      Splash.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AppProvider id={env.APP_ID_REALM} baseUrl={env.APP_URL_REALM}>
        <UserProvider fallback={<SplashScreen signin={true} />}>
          <RealmProvider
            schema={schemas}
            sync={{
              flexible: true,
              // initialSubscriptions: {
              //   update: (mutableSubs, realm) => {
              //     mutableSubs.add(realm.objects(User));
              //     mutableSubs.add(realm.objects(Account));
              //     mutableSubs.add(realm.objects(Budget));
              //     mutableSubs.add(realm.objects(Transaction));
              //   },
              // },
              onError: (_session, error) => {
                console.error(error);
              },
              newRealmFileBehavior: {
                type: OpenRealmBehaviorType.DownloadBeforeOpen,
              },
              existingRealmFileBehavior: {
                type: OpenRealmBehaviorType.OpenImmediately,
              },
            }}
            fallback={<SplashScreen signin={false} />}>
            {isLoggedIn ? <DashStack /> : <AuthStack />}
          </RealmProvider>
        </UserProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
