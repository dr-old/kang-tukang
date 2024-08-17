import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

interface RadioButtonProps {
  name: string;
  selectedValue: string;
  options: { value: string; label: string }[];
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
  error?: string[];
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  selectedValue,
  options,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          activeOpacity={0.8}
          style={styles.radioContainer}
          onPress={() => onChange(name, option.value)}
          onBlur={() => onBlur(name)}>
          <FontAwesome
            name={selectedValue === option.value ? "dot-circle-o" : "circle-o"}
            color={Colors.primary}
            size={16}
          />
          <ThemedText font="regular" style={{ marginLeft: 5, flex: 1 }}>
            {option.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
      {error && <Text style={styles.errorText}>{error.join(", ")}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginRight: 10,
  },
  radioCircleSelected: {
    backgroundColor: "#007bff",
  },
  radioLabel: {
    fontSize: 14,
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
});
