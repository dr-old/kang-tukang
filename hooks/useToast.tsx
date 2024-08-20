import Toast from "@/components/Toast";
import React, { createContext, useState, useContext, ReactNode } from "react";

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
