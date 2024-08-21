import { responsiveHeight, responsiveWidth } from "@/utils/sizing";
import { router } from "expo-router";
import { Image, TouchableOpacity } from "react-native";

const HeaderBack = (props?: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.back()}
      {...props}>
      <Image
        style={{
          height: responsiveHeight(24),
          width: responsiveWidth(24),
        }}
        source={require("@/assets/images/Arrow Back.png")}
      />
    </TouchableOpacity>
  );
};

export default HeaderBack;
