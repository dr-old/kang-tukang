import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  ViewStyle,
  useColorScheme,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { hexToRgba } from "../utils/helpers";
import { ToastProvider } from "./useToast";
import { Colors } from "@/constants/Colors";

interface ModalContextProps {
  showModal: (
    content: ReactNode,
    position?: string,
    radius?: number,
    width?: string
  ) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState<any>({});
  const [modalContent, setModalContent] = useState<ReactNode | undefined>(
    undefined
  );
  const colorScheme = useColorScheme();
  const styles = styling(Colors[colorScheme ?? "light"]);

  const showModal = (
    content: ReactNode,
    position?: string,
    radius?: number,
    width?: string
  ) => {
    setModalContent(content);
    setModalPosition({ position, radius, width });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  let position: ViewStyle;
  let radius: ViewStyle;
  let rds = modalPosition?.radius || 26;

  if (modalPosition?.position === "top") {
    position = { justifyContent: "flex-start" };
    radius = {
      borderBottomLeftRadius: rds,
      borderBottomRightRadius: rds,
    };
  } else if (modalPosition?.position === "bottom") {
    position = { justifyContent: "flex-end" };
    radius = {
      borderTopLeftRadius: rds,
      borderTopRightRadius: rds,
    };
  } else {
    position = { justifyContent: "center" };
    radius = { borderRadius: rds };
  }

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      <ToastProvider>{children}</ToastProvider>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={hideModal}>
        <Pressable onPress={hideModal} style={[styles.modalOverlay, position]}>
          <Animatable.View
            animation={modalVisible ? "bounceIn" : "bounceOut"}
            duration={300}
            style={[
              styles.wrapper,
              radius,
              modalPosition?.width ? { width: modalPosition?.width } : {},
            ]}>
            {modalContent}
          </Animatable.View>
        </Pressable>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

const styling = (theme: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      alignItems: "center",
      backgroundColor: hexToRgba(Colors.black, 0.5),
    },
    modalContainer: {
      width: 300,
      padding: 20,

      alignItems: "center",
    },
    closeButton: {
      marginTop: 20,
      color: "blue",
      textDecorationLine: "underline",
    },
    wrapper: {
      backgroundColor: theme.background,
      // padding: 20,
    },
  });
