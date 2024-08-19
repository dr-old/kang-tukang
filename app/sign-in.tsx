import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function SignInScreen() {
  const { setProfile, setLogIn } = useUserStore() as unknown as UserStoreType;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          setProfile({
            _id: "user._id",
            birthday: "user.birthday",
            createdAt: "user.createdAt",
            email: "user.email",
            name: "user.name",
            phone: "user.phone",
            photo: "user.photo",
            address: "user.address",
            updatedAt: "user.updatedAt",
          });
          setLogIn(true);
          router.replace("/");
        }}>
        Sign In
      </Text>
    </View>
  );
}
