import React, { ReactNode } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useModal } from "../hooks/useModal";
import { hexToRgba } from "../utils/helpers";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import ModalContainer from "./ModalContainer";
import Divider from "./Divider";
import { ThemedButton } from "./ThemedButton";
import { useThemeToggle } from "@/hooks/useThemeToggle";

interface ModalAlertProps {
  refView?: React.MutableRefObject<any>;
  title: string;
  subtitle?: string;
  onConfirm: () => void;
  onCancel?: () => void | undefined;
  message: string;
  icon?: ReactNode;
  type?: string;
  labelConfirm?: string;
  labelCancel?: string;
}

const ModalAlert: React.FC<ModalAlertProps> = ({
  refView,
  title,
  subtitle,
  onConfirm,
  onCancel,
  message,
  icon,
  type,
  labelConfirm,
  labelCancel,
}) => {
  const { hideModal } = useModal();
  const { colorScheme } = useThemeToggle();
  const theme = Colors[colorScheme ?? "light"];
  const styles = styling(theme);

  const handleCancel = () => {
    hideModal();
    onCancel?.();
  };

  const handleConfirm = () => {
    hideModal();
    onConfirm?.();
  };

  const Body = () => {
    return (
      <View style={styles.body}>
        {icon && icon}
        <ThemedText font="regular" style={{ paddingHorizontal: 20 }}>
          {message}
        </ThemedText>
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
      </View>
    );
  };

  if (refView) {
    return (
      <ModalContainer title={title} subtitle={subtitle} ref={refView}>
        <Body />
      </ModalContainer>
    );
  }

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
      <Body />
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
    wrapper: {
      width: "80%",
      backgroundColor: theme.background,
      borderRadius: 8,
      padding: 16,
    },
    headerModal: {
      alignItems: "center",
    },
  });

export default ModalAlert;
