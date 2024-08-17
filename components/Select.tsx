import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SelectProps {
  name: string;
  selectedValue: string;
  options: { label: string; value: string }[];
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
  error?: string[];
}

export const Select: React.FC<SelectProps> = ({
  name,
  selectedValue,
  options,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue?: any) => onChange(name, itemValue)}
        onBlur={() => onBlur(name)}
        style={styles.picker}>
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
      {error && <Text style={styles.errorText}>{error.join(", ")}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
});
