import HeaderBack from "@/components/HeaderBack";
import HeaderRight from "@/components/HeaderRight";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

const ProfileStack = () => {
  const colorScheme = useColorScheme();
  const dash = [{ title: "index", header: true }];
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
            headerRight(props) {
              return <HeaderRight {...props} />;
            },
          }}
        />
      ))}
    </Stack>
  );
};

export default ProfileStack;
