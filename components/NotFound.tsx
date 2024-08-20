import { AntDesign } from "@expo/vector-icons";
import { View, useColorScheme } from "react-native";
import Divider from "./Divider";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

const NotFound = () => {
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 17,
        paddingVertical: 50,
      }}>
      <AntDesign
        size={100}
        name="unknowfile1"
        color={Colors[colorScheme ?? "light"].text}
      />
      <Divider width={10} height={10} />
      <ThemedText type="title">Ooops!</ThemedText>
      <ThemedText font="regular">Sorry data is not found</ThemedText>
    </View>
  );
};

export default NotFound;
