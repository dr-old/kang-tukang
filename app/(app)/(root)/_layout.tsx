import HeaderBack from "@/components/HeaderBack";
import { Colors } from "@/constants/Colors";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { isLoggedIn, setLogIn } = useUserStore() as unknown as UserStoreType;
  const { colorScheme } = useThemeToggle();

  if (!isLoggedIn) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/auth" />;
  }

  const dash = [
    { title: "(tabs)", header: false },
    { title: "index", header: false },
    { title: "order", header: true },
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
              backgroundColor: Colors.warning,
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
}
