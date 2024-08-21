import { AntDesign } from "@expo/vector-icons";
import { View } from "react-native";
import Divider from "./Divider";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeToggle } from "@/hooks/useThemeToggle";

interface NotFoundProps {
  iconSize?: number;
  enableIcon?: boolean;
  ph?: number;
}

const NotFound = ({
  enableIcon = true,
  iconSize = 70,
  ph = 50,
}: NotFoundProps) => {
  const { colorScheme } = useThemeToggle();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 17,
        paddingVertical: ph,
        opacity: 0.5,
      }}>
      {enableIcon && (
        <AntDesign
          size={iconSize}
          name="unknowfile1"
          color={Colors[colorScheme ?? "light"].text}
        />
      )}
      <Divider width={10} height={10} />
      <ThemedText type="title">Ooops!</ThemedText>
      <ThemedText font="regular">Sorry data is not found</ThemedText>
    </View>
  );
};

export default NotFound;
