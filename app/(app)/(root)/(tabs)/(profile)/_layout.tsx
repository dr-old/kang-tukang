import HeaderBack from "@/components/HeaderBack";
import HeaderRight from "@/components/HeaderRight";
import { Colors } from "@/constants/Colors";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { Stack } from "expo-router";

const ProfileStack = () => {
  const { colorScheme } = useThemeToggle();
  const dash = [
    { title: "index", header: true, headerRight: true },
    { title: "update-profile", header: true, headerRight: false },
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
            headerRight(props) {
              return item.headerRight && <HeaderRight {...props} />;
            },
          }}
        />
      ))}
    </Stack>
  );
};

export default ProfileStack;
