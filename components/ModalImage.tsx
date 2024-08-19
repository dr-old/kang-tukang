import React from "react";
import {
  Dimensions,
  Image,
  ImageStyle,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { calculateAspectRatio } from "@/utils/sizing";

interface ModalAlertProps {
  image?: any;
  style?: ImageStyle;
}

const ModalImage: React.FC<ModalAlertProps> = ({ image, style }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = styling(theme);

  return (
    <View style={styles.container}>
      <Image
        source={image || require("@/assets/images/modal-welcome.png")}
        style={[style, styles.image]}
      />
    </View>
  );
};

const styling = (theme: any) =>
  StyleSheet.create({
    container: {
      maxWidth: Dimensions.get("screen").width * 0.8,
      paddingVertical: 20,
    },
    image: {
      width: "100%",
      height: undefined,
      resizeMode: "contain",
      aspectRatio: calculateAspectRatio(
        Dimensions.get("window").width,
        Dimensions.get("window").height * 0.5
      )?.aspectRatio,
      borderRadius: 20,
    },
  });

export default ModalImage;
