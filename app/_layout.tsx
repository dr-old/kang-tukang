import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, Stack, router } from "expo-router";
import "react-native-reanimated";
import "expo-dev-client";
import "react-native-get-random-values";
import * as Splash from "expo-splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
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
import { Image, LogBox, TouchableOpacity } from "react-native";
import { UserStoreType } from "@/utils/types";
import { useUserStore } from "@/stores/user/userStore";
import SplashScreen from "./splash";
import { OpenRealmBehaviorType } from "realm";
import { schemas } from "@/schemes";
import { User } from "@/schemes/UserScheme";
import { Service } from "@/schemes/ServiceScheme";
import { TransactionDetail } from "@/schemes/TransactionDetailScheme";
import { Message } from "@/schemes/MessageScheme";
import { responsiveHeight, responsiveWidth } from "@/utils/sizing";
import { Colors } from "@/constants/Colors";
import { ModalProvider } from "@/hooks/useModal";
import { Transaction } from "@/schemes/TransactionScheme";
import { Cart } from "@/schemes/CartScheme";
import { Account } from "@/schemes/AccountScheme";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const HeaderBack = (props: any) => {
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
};

const DashStack = () => {
  const colorScheme = useColorScheme();
  const dash = [
    { title: "index", header: false },
    { title: "sign-in", header: false },
    { title: "(tabs)", header: false },
    { title: "login", header: true },
    { title: "register", header: true },
    { title: "response", header: false },
    { title: "+not-found", header: false },
  ];
  return (
    <Stack>
      {dash.map((item: any, index: number) => (
        <Stack.Screen
          key={index.toString()}
          name={item.title}
          options={{
            headerShown: item.header,
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
            headerTitle: "",
            headerTintColor: Colors[colorScheme ?? "light"].text,
            headerShadowVisible: false,
            headerLeft(props) {
              return <HeaderBack {...props} />;
            },
          }}
        />
      ))}
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
      <ModalProvider>
        <AppProvider id={env.APP_ID_REALM}>
          <UserProvider fallback={<SplashScreen signin={true} />}>
            <RealmProvider
              schema={schemas}
              sync={{
                flexible: true,
                initialSubscriptions: {
                  update: (mutableSubs, realm) => {
                    mutableSubs.add(realm.objects(Account));
                    mutableSubs.add(realm.objects(Cart));
                    mutableSubs.add(realm.objects(User));
                    mutableSubs.add(realm.objects(Service));
                    mutableSubs.add(realm.objects(Transaction));
                    mutableSubs.add(realm.objects(TransactionDetail));
                    mutableSubs.add(realm.objects(Message));
                  },
                },
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
              <Slot />
            </RealmProvider>
          </UserProvider>
        </AppProvider>
      </ModalProvider>
    </ThemeProvider>
  );
}
