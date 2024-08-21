import { ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";
import "react-native-reanimated";
import "expo-dev-client";
import "react-native-get-random-values";
import * as Splash from "expo-splash-screen";
import { useEffect } from "react";
import { AppProvider, RealmProvider, UserProvider } from "@realm/react";
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
import { LogBox } from "react-native";
import SplashScreen from "./splash";
import { OpenRealmBehaviorType } from "realm";
import { schemas } from "@/schemes";
import { ModalProvider } from "@/hooks/useModal";
import { useThemeToggle } from "@/hooks/useThemeToggle";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

export default function RootLayout() {
  const { theme } = useThemeToggle();
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
    <ThemeProvider value={theme}>
      <AppProvider id={env.APP_ID_REALM}>
        <UserProvider fallback={<SplashScreen signin={true} />}>
          <RealmProvider
            schema={schemas}
            sync={{
              flexible: true,
              // initialSubscriptions: {
              //   update: (mutableSubs, realm) => {
              //     mutableSubs.add(realm.objects(Account));
              //     mutableSubs.add(realm.objects(AccountLog));
              //     mutableSubs.add(realm.objects(Cart));
              //     mutableSubs.add(realm.objects(User));
              //     mutableSubs.add(realm.objects(Service));
              //     mutableSubs.add(realm.objects(Transaction));
              //     mutableSubs.add(realm.objects(TransactionDetail));
              //     mutableSubs.add(realm.objects(TransactionLog));
              //     mutableSubs.add(realm.objects(Message));
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
            <ModalProvider>
              <Slot />
            </ModalProvider>
          </RealmProvider>
        </UserProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
