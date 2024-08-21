import HeaderBack from "@/components/HeaderBack";
import { Colors } from "@/constants/Colors";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { Stack } from "expo-router";

const OrderStack = () => {
  const { colorScheme } = useThemeToggle();
  const dash = [
    { title: "index", header: true },
    { title: "detail", header: true },
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

export default OrderStack;
