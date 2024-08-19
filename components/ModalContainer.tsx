import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Dimensions,
  Pressable,
  useColorScheme,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { hexToRgba } from "../utils/helpers";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import Divider from "./Divider";

interface ModalContainerProps {
  title: string;
  subtitle?: string;
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export interface ModalContainerRef {
  show: () => void;
  hide: () => void;
}

const ModalContainer: React.ForwardRefRenderFunction<
  ModalContainerRef,
  ModalContainerProps
> = ({ title, subtitle, width, height, children }, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const styles = styling(Colors[colorScheme ?? "light"]);

  useImperativeHandle(ref, () => ({
    show: () => {
      setModalVisible(true);
    },
    hide: () => {
      setModalVisible(false);
    },
  }));

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => ref?.current?.hide()}>
      <Pressable onPress={() => ref?.current?.hide()} style={styles.container}>
        <Animatable.View
          animation={modalVisible ? "bounceIn" : "bounceOut"}
          duration={300}
          style={styles.wrapper}>
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
            <View
              style={{
                minHeight: 50,
                maxHeight: height
                  ? height
                  : Dimensions.get("screen").height * 0.8,
              }}>
              {children}
            </View>
          </View>
        </Animatable.View>
      </Pressable>
    </Modal>
  );
};

const styling = (theme: any) =>
  StyleSheet.create({
    body: {
      paddingTop: 16,
    },
    container: {
      flex: 1,
      backgroundColor: hexToRgba(Colors.black, 0.7),
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    wrapper: {
      width: "100%",
      backgroundColor: theme.background,
      borderRadius: 8,
      padding: 16,
    },
    headerModal: {
      alignItems: "center",
    },
  });

export default forwardRef(ModalContainer);
