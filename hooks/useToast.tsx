import Toast from "@/components/Toast";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { StyleSheet } from "react-native";

// Toast Context
interface ToastContextProps {
  showToast: (message: string, status: string, type?: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Toast Provider
export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<any>(null);

  const showToast = (message: string, status: string, type?: string) => {
    setToastMessage({ message, status, type });
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
    setToastMessage(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toastVisible && (
        <Toast
          message={toastMessage.message}
          status={toastMessage.status}
          type={toastMessage.type}
          visible={toastVisible}
          onHide={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

// Helper function to use Toast context
export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Example styles
const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 8,
  },
  toastText: {
    color: "white",
    fontSize: 16,
  },
});
