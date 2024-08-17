import React from "react";
import { View, StyleSheet } from "react-native";
import ErrorMessage from "./ErrorMessage";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

interface FormContainerProps {
  iconSuffix?: React.ReactNode;
  iconPrefix?: React.ReactNode;
  children: React.ReactNode;
  error?: string[];
  label?: string;
  style?: object;
  radius?: number;
}

const Form: React.FC<FormContainerProps> = ({
  iconSuffix,
  iconPrefix,
  label,
  children,
  error,
  style,
  radius,
}) => {
  const color = useThemeColor({}, "input");
  console.log("error", typeof error);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        {label && (
          <ThemedText font="medium" style={styles.label}>
            {label}
          </ThemedText>
        )}
      </View>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: color,
            borderColor: error && error?.length > 0 ? Colors.danger : color,
            borderRadius: radius || 10,
          },
        ]}>
        {iconPrefix}
        {children}
        {iconSuffix}
      </View>
      {error && <ErrorMessage errors={error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 5,
  },
  label: { flex: 1, textTransform: "capitalize" },
  labelLeft: {
    textTransform: "capitalize",
  },
  labelRight: {
    textTransform: "lowercase",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});

export default Form;
