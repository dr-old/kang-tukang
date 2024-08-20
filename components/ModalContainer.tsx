import React, { ReactNode } from "react";
import { Dimensions, StyleSheet, View, useColorScheme } from "react-native";
import { useModal } from "../hooks/useModal";
import { hexToRgba } from "../utils/helpers";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import Divider from "./Divider";
import { ThemedButton } from "./ThemedButton";

interface ModalAlertProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel?: () => void | undefined;
  labelConfirm?: string;
  labelCancel?: string;
}

const ModalContainer: React.FC<ModalAlertProps> = ({
  title,
  subtitle,
  children,
  onConfirm,
  onCancel,
  labelConfirm,
  labelCancel,
}) => {
  const { hideModal } = useModal();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = styling(theme);

  const handleCancel = () => {
    hideModal();
    onCancel?.();
  };

  const handleConfirm = () => {
    // hideModal();
    onConfirm?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerModal}>
        <ThemedText font="semiBold" type="normal">
          {title}
        </ThemedText>
        {subtitle && (
          <>
            <Divider height={16} />
            <ThemedText font="light">{subtitle}</ThemedText>
          </>
        )}
      </View>
      <View style={styles.body}>
        {children}
        {(labelConfirm || labelCancel) && (
          <View style={styles.button}>
            {labelConfirm && (
              <ThemedButton
                height={40}
                type="primary"
                title={labelConfirm}
                onPress={handleConfirm}
              />
            )}
            {labelConfirm && labelCancel && <Divider height={0} width={16} />}
            {labelCancel && (
              <ThemedButton
                height={40}
                type="default"
                title={labelCancel}
                onPress={handleCancel}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styling = (theme: any) =>
  StyleSheet.create({
    button: {
      flexDirection: "row-reverse",
      marginTop: 16,
      paddingTop: 16,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: hexToRgba(Colors.border, 0.5),
    },
    body: {
      paddingTop: 16,
      minHeight: 50,
      maxHeight: Dimensions.get("screen").height * 0.8,
    },
    container: {
      maxWidth: Dimensions.get("screen").width * 0.8,
      paddingVertical: 20,
    },
    headerModal: {
      alignItems: "center",
    },
  });

export default ModalContainer;
