import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { hexToRgba } from "@/utils/helpers";
import Divider from "./Divider";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface CardProps {
  color?: string;
  balance?: string;
  colorCheck?: string;
  borderColor?: string;
  valid?: boolean;
  onPress?: () => void;
}

const OrderPayment: React.FC<CardProps> = ({
  color,
  balance,
  colorCheck,
  valid,
  borderColor,
  onPress,
}) => {
  return (
    <View>
      <ThemedText font="medium" type="default">
        Payment Method
      </ThemedText>
      <Divider height={5} />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          ...styles.payment,
          backgroundColor: hexToRgba(Colors.info, 0.1),
          borderColor,
        }}>
        <MaterialIcons name="attach-money" size={30} color={color} />
        <View style={{ flex: 1, marginLeft: 5 }}>
          <ThemedText
            lightColor={color}
            darkColor={color}
            font="regular"
            type="semiSmall">
            Your Balance
          </ThemedText>
          <ThemedText
            lightColor={color}
            darkColor={color}
            font="medium"
            type="default">
            {balance}
          </ThemedText>
        </View>
        <MaterialIcons name="check-circle" size={30} color={colorCheck} />
      </TouchableOpacity>
      <Divider height={5} />
      {valid && (
        <ThemedText
          lightColor={Colors.danger}
          darkColor={Colors.danger}
          font="regular"
          textAlign="center"
          type="semiSmall">
          Your balance is insufficient, please top-up your balance!
        </ThemedText>
      )}
      <Divider height={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  payment: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default OrderPayment;
