import { Alert, Linking, Platform, ToastAndroid } from "react-native";

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

export const directWhatsapp = (phone?: string) => {
  try {
    const url = `whatsapp://send?text=hello&phone=62${phone}`;
    console.log(url);

    Linking.openURL(url).catch(() => {
      throw new Error(
        "Unable to open WhatsApp. Please make sure it is installed on your device."
      );
    });
  } catch (error: any) {
    toast(error.message || "An unexpected error occurred.");
  }
};

export function transactionStatus(
  trxId: string,
  amount: number,
  status: number
) {
  const newAmount = formatCurrency(amount, "Rp");
  const trxStatus = [
    {
      id: 1,
      title: "Await Payment",
      type: "warning",
      message: `Your order with transaction ID: ${trxId} is awaiting payment of ${newAmount}. Please complete the payment to proceed.`,
      subtitle: "Payment Pending",
    },
    {
      id: 2,
      title: "Check Payment",
      type: "warning",
      message: `We're checking the payment of ${newAmount} for your transaction ID: ${trxId}. This may take a few minutes.`,
      subtitle: "Verifying Payment",
    },
    {
      id: 3,
      title: "Find Repairman",
      type: "info",
      message: `We're locating a repairman for your service request with transaction ID: ${trxId}. Please wait.`,
      subtitle: "Searching for Repairman",
    },
    {
      id: 4,
      title: "In Progress",
      type: "info",
      message: `Your service request with transaction ID: ${trxId} is in progress. The repairman is working on it.`,
      subtitle: "Service In Progress",
    },
    {
      id: 5,
      title: "Done",
      type: "success",
      message: `Your service request with transaction ID: ${trxId} has been completed successfully. Thank you for using our service!`,
      subtitle: "Yeah, order has been completed",
    },
    {
      id: 6,
      title: "Cancel By User",
      type: "danger",
      message: `You have canceled the service request with transaction ID: ${trxId}. We hope to assist you again soon.`,
      subtitle: "Service Canceled by You",
    },
    {
      id: 7,
      title: "Cancel By Repairman",
      type: "danger",
      message: `The service request with transaction ID: ${trxId} has been canceled by the repairman. Please contact support for assistance.`,
      subtitle: "Service Canceled by Repairman",
    },
  ];

  return trxStatus.find((notification) => notification.id === status);
}
