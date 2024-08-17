import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Colors } from "@/constants/Colors";

const ErrorMessage = ({ errors }: { errors?: any }) => {
  if (!errors) return;
  return (
    <View style={styles.error}>
      {errors.map((i: string, index: number) => (
        <View key={index.toString()} style={styles.textError}>
          <FontAwesome6
            name="triangle-exclamation"
            color={Colors.danger}
            library="Octicons"
            size={12}
          />
          <ThemedText
            font="medium"
            type="small"
            lightColor={Colors.danger}
            darkColor={Colors.danger}
            style={{ marginLeft: 5, flex: 1 }}>
            {i}
          </ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  error: { marginTop: 5 },
  textError: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
});

export default ErrorMessage;
