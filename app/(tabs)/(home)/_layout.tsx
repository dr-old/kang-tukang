import HeaderBack from "@/components/HeaderBack";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

const HomeStack = () => {
  const colorScheme = useColorScheme();
  const dash = [
    { title: "index", header: false },
    { title: "feature", header: true },
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
};

export default HomeStack;
