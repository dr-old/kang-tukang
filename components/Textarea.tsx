import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import ErrorMessage from "./ErrorMessage";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { responsiveHeight } from "@/utils/sizing";

interface TextareaProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
  error?: string[];
  placeholder?: string;
  style?: any;
}

export const Textarea: React.FC<TextareaProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  style,
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
          style,
          styles.textarea,
          {
            backgroundColor: color,
            borderColor:
              error && error?.length > 0
                ? Colors.danger
                : style?.borderColor || color,
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    textAlignVertical: "top",
    minHeight: responsiveHeight(40),
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
