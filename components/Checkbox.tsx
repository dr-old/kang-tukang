import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import ErrorMessage from "./ErrorMessage";

interface CheckboxProps {
  name: string;
  checked: string; // Updated to use string instead of boolean
  value: string; // Added to represent the value of the checkbox
  onChange: (name: string, value: string) => void; // Updated to use string
  onBlur: (name: string) => void;
  error?: string[];
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  checked,
  value, // New prop to represent the value of the checkbox
  onChange,
  onBlur,
  error,
  label,
}) => {
  const color = useThemeColor({}, "text");
  const isChecked = checked === value; // Determine if the checkbox is checked based on value

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.checkboxContainer}
        onPress={() => onChange(name, isChecked ? "" : value)} // Toggle value on press
        onBlur={() => onBlur(name)}>
        <ThemedView
          style={[
            styles.checkbox,
            { borderColor: error ? Colors.danger : Colors.white },
          ]}>
          {isChecked && <FontAwesome name={"check"} color={color} size={16} />}
        </ThemedView>
        <ThemedText
          font="medium"
          type="small"
          lightColor={Colors.white}
          darkColor={Colors.white}
          style={{
            marginLeft: 5,
          }}>
          {label}
        </ThemedText>
      </TouchableOpacity>
      {error && <ErrorMessage errors={error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
  },
  checkboxChecked: {
    backgroundColor: "#007bff",
  },
  checkboxLabel: {
    fontSize: 14,
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
});
