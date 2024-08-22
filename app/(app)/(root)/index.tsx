import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function SignOut() {
  const { profile, isLoggedIn, setLogIn } =
    useUserStore() as unknown as UserStoreType;

  if (isLoggedIn && profile?._id) {
    return <Redirect href="/(tabs)" />;
  } else if (!isLoggedIn) {
    return <Redirect href="/auth" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          setLogIn(false);
        }}>
        Sign Out
      </Text>
    </View>
  );
}
