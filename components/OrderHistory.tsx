import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useThemeToggle } from "@/hooks/useThemeToggle";

interface CardProps {
  title: string;
  date: string;
  index: number;
}

const OrderHistory: React.FC<CardProps> = ({ title, date, index }) => {
  const { colorScheme } = useThemeToggle();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      style={{
        flexDirection: "row",
        opacity: index === 0 ? 1 : 0.5,
        height: 50,
      }}>
      <View
        style={{
          alignItems: "center",
        }}>
        <MaterialIcons
          name={index === 0 ? "radio-button-on" : "radio-button-off"}
          size={20}
          color={index === 0 ? Colors.info : theme.text}
        />
        <View
          style={{
            backgroundColor: index === 0 ? Colors.info : theme.text,
            width: 3,
            flex: 1,
            borderRadius: 5,
          }}
        />
      </View>
      <View
        style={{
          marginLeft: 10,
          flex: 1,
          justifyContent: "center",
        }}>
        <ThemedText font="medium" type="semiSmall">
          {title}
        </ThemedText>
        <ThemedText font="light" type="small">
          {moment(date).format("DD MMM YYYY HH:mm")}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default OrderHistory;
