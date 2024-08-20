import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  Animated,
  Platform,
  Dimensions,
  useColorScheme,
} from "react-native";
import { hexToRgba } from "../utils/helpers";
import * as Animatable from "react-native-animatable";
import Divider from "./Divider";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

export interface ToastStatus {
  status: "success" | "error" | "warning" | "info";
}

interface ToastProps {
  message: string;
  status: string;
  visible: boolean;
  type?: string;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  status,
  type,
  visible,
  onHide,
}) => {
  const colorScheme = useColorScheme();
  const styles = styling(Colors[colorScheme ?? "light"]);
  const viewRef = useRef<any>(null);

  const fadeAnim = useState(new Animated.Value(0))[0];

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onHide());
  };

  const zoomIn = () => {
    if (viewRef.current) {
      viewRef.current
        .zoomIn(400)
        .then((endState: any) =>
          console.log(
            endState.finished ? "bounce finished" : "bounce cancelled"
          )
        );
    }
  };

  const zoomOut = () => {
    if (viewRef.current) {
      viewRef.current.zoomOut(400).then((endState: any) => onHide());
    }
  };

  const handleHide = () => {
    zoomOut();
  };

  useEffect(() => {
    if (visible) {
      zoomIn();
      !type && setTimeout(() => zoomOut(), 2000); // Auto hide after 2 seconds
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  let backgroundColor = Colors.primary;
  if (status === "error") {
    backgroundColor = Colors.danger;
  } else if (status === "warning") {
    backgroundColor = Colors.warning;
  } else if (status === "success") {
    backgroundColor = Colors.success;
  }

  if (type == "modal") {
    return (
      <View style={styles.modalOverlay}>
        <Pressable onPress={handleHide} style={styles.flexCenter}>
          <Animatable.View
            ref={viewRef}
            style={[styles.shadow, styles.contentCenter]}>
            <Ionicons
              name={
                status === "error"
                  ? "close-circle"
                  : status === "warning"
                  ? "warning"
                  : status === "success"
                  ? "checkmark-circle"
                  : "information-circle"
              }
              color={backgroundColor}
              backgroundSize={120}
              size={120}
            />
            <Divider height={10} />
            <ThemedText font="semiBold" style={{ textTransform: "capitalize" }}>
              {status.toString()}
            </ThemedText>
            <Divider height={4} />
            <ThemedText style={styles.flex}>{message}</ThemedText>
          </Animatable.View>
        </Pressable>
      </View>
    );
  }

  return (
    <Animatable.View
      ref={viewRef}
      style={[styles.container, { opacity: fadeAnim }]}>
      <Pressable onPress={onHide} style={[styles.shadow, { borderRadius: 15 }]}>
        <View style={styles.rowCenter}>
          <Ionicons
            name={
              status === "error"
                ? "close-circle"
                : status === "warning"
                ? "warning"
                : status === "success"
                ? "checkmark-circle"
                : "information-circle"
            }
            color={backgroundColor}
            size={24}
          />
          <View style={styles.desc}>
            <ThemedText font="semiBold" style={{ textTransform: "capitalize" }}>
              {status.toString()}
            </ThemedText>
            <Divider height={4} />
            <ThemedText style={styles.flex}>{message}</ThemedText>
          </View>
        </View>
      </Pressable>
    </Animatable.View>
  );
};

const styling = (theme: any) =>
  StyleSheet.create({
    modalOverlay: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: hexToRgba(Colors.black, 0.5),
    },
    container: {
      position: "absolute",
      top: Platform.OS === "android" ? 30 : 60,
      left: 20,
      right: 20,
      alignItems: "center",
    },
    rowCenter: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    flexCenter: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    contentCenter: {
      height: Dimensions.get("window").height * 0.3,
      width: Dimensions.get("window").height * 0.3,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    flex: {
      flex: 1,
    },
    desc: {
      flex: 1,
      marginHorizontal: 10,
    },
    shadow: {
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 12,
      backgroundColor: theme.background,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
      overflow: "visible",
    },
    content: {
      padding: 16,
      borderRadius: 4,
    },
    title: {
      fontSize: 16,
    },
  });

export default Toast;
