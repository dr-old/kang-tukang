import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function SignIn() {
  const { setProfile, setLogIn } = useUserStore() as unknown as UserStoreType;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          setLogIn(true);
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace("/");
        }}>
        Sign In
      </Text>
    </View>
  );
}
