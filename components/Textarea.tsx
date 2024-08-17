import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import ErrorMessage from "./ErrorMessage";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";

interface TextareaProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
  error?: string[];
  placeholder?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}) => {
  const color = useThemeColor({}, "input");

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {name && (
          <ThemedText font="medium" style={styles.label}>
            {name}
          </ThemedText>
        )}
      </View>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(name, text)}
        onBlur={() => onBlur(name)}
        placeholder={placeholder}
        multiline
        numberOfLines={4}
        style={[
          styles.textarea,
          {
            backgroundColor: color,
            borderColor: error ? Colors.danger : color,
          },
        ]}
      />
      {error && <ErrorMessage errors={error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  textarea: {
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 5,
  },
  label: { flex: 1, textTransform: "capitalize" },
});
