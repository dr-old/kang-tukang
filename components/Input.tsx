import React, { ReactNode } from "react";
import { TextInput, StyleSheet } from "react-native";
import Form from "./Form";
import { responsiveHeight } from "@/utils/sizing";

interface InputProps {
  name: string;
  label?: string;
  labelOff?: boolean;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur: (name: string) => void;
  error?: string[];
  placeholder?: string;
  secureTextEntry?: boolean;
  preffix?: ReactNode;
  suffix?: ReactNode;
  radius?: number;
}

export const Input: React.FC<InputProps> = ({
  name,
  label,
  labelOff,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  secureTextEntry,
  preffix,
  suffix,
  radius,
}) => {
  return (
    <Form
      label={labelOff ? undefined : label || name}
      error={error}
      radius={radius}
      iconPrefix={preffix}
      iconSuffix={suffix}>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(name, text)}
        onBlur={() => onBlur(name)}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
      />
    </Form>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    height: responsiveHeight(40),
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
});
