import { Alert, Platform, ToastAndroid } from "react-native";

export const toast = (message: string) => {
  if (Platform.OS === "ios") {
    Alert.alert(message);
  } else {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
};

export const hexToRgba = (hex: string, opacity: any) => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse the r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Return the RGBA color
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const formatCurrency = (number: number, prefix: string) => {
  return prefix + number.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

// Function to generate a unique transaction ID
export const generateTrxId = (): string => {
  const timestamp = Date.now();
  // Generate a random number between 1000 and 9999
  const randomComponent = Math.floor(1000 + Math.random() * 9000);
  // Combine them to create a unique trxId
  const trxId = `TRX-${timestamp}-${randomComponent}`;

  return trxId;
};
