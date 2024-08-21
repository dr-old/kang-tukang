import React, { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { formatCurrency, hexToRgba, toast } from "../utils/helpers";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { Input } from "./Input";
import { Feather } from "@expo/vector-icons";
import { ThemedButton } from "./ThemedButton";
import ModalContainer from "./ModalContainer";
import { useAccountActions } from "@/services/useAccountActions";
import { useModal } from "@/hooks/useModal";
import { useAccountLogActions } from "@/services/useAccountLogActions";
import { useMessageActions } from "@/services/useMessageActions";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { BSON } from "realm";

interface ModalAlertProps {
  onConfirm?: () => void;
  onCancel?: () => void | undefined;
  labelConfirm?: string;
  labelCancel?: string;
}

const balanceList = [10000, 50000, 100000, 200000, 500000];

const ModalTopup: React.FC<ModalAlertProps> = ({
  onConfirm,
  onCancel,
  labelConfirm,
  labelCancel,
}) => {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new BSON.ObjectId(profile?._id);
  const { hideModal } = useModal();
  const { topupBalance } = useAccountActions();
  const { createLog } = useAccountLogActions();
  const { createMessage } = useMessageActions();
  const { colorScheme } = useThemeToggle();
  const theme = Colors[colorScheme ?? "light"];
  const styles = styling(theme);
  const [visible, setVisible] = useState(false);
  const [balance, setBalance] = useState("");

  const onSubmit = () => {
    const newInput = balance.toString();
    const numericValue = newInput.replace(/[^0-9,]/g, "");

    if (!numericValue) {
      toast("Top-up balance is required!");
    } else if (Number(numericValue) < 10000) {
      toast("Minimal top-up Rp10.000!");
    } else {
      try {
        const data = {
          accountName: "Balance",
          accountType: 1,
          status: 1,
          balance: Number(numericValue),
        };
        const newbalance = topupBalance(data);
        if (newbalance?._id) {
          createLog({ ...data, accountId: newbalance._id });
          createMessage({
            title: "Top-up Successful",
            message: `Your account has been successfully topped up with ${formatCurrency(
              Number(numericValue),
              "Rp"
            )} for main balance.`,
            sender: userId.toString(),
            receiver: userId.toString(),
          });
          toast("Top-up successfully!");
          hideModal();
        }
      } catch (error: any) {
        console.error(error?.message);

        toast(error?.message || "Something wrong top-up failed");
      }
    }
  };

  const handleBalance = (name: string, value: string) => {
    const newInput = value.toString();
    const numericValue = newInput.replace(/[^0-9,]/g, "");
    if (numericValue) {
      setBalance(formatCurrency(Number(numericValue), ""));
    } else {
      setBalance("");
    }
  };

  const handleFormated = (inputValue: string) => {
    const newInput = inputValue.toString();
    const numericValue = newInput.replace(/[^0-9,]/g, "");
    return Number(numericValue);
  };

  return (
    <ModalContainer
      onConfirm={onSubmit}
      title="Select Top-up Balance"
      labelConfirm="Continue"
      labelCancel="Cancel">
      <View>
        <View style={styles.topup}>
          {balanceList.map((item, index) => (
            <TouchableOpacity
              key={index.toString()}
              activeOpacity={0.8}
              onPress={() => handleBalance("balance", item.toString())}
              style={{
                backgroundColor:
                  handleFormated(balance) === item
                    ? Colors.warning
                    : Colors[colorScheme ?? "light"].input,
                borderColor: Colors[colorScheme ?? "light"].border,
                ...styles.balance,
              }}>
              <ThemedText font="regular" textAlign="center">
                {formatCurrency(item, "Rp")}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.input}>
          {!visible ? (
            <ThemedButton
              height={40}
              type="warning"
              title={"Input Manual"}
              onPress={() => setVisible(!visible)}
              style={{
                marginBottom: 16,
              }}
            />
          ) : (
            <Input
              labelOff={true}
              name="balance"
              value={balance}
              onChange={handleBalance}
              onBlur={(val) => console.log()}
              placeholder="0"
              preffix={<ThemedText style={{ marginLeft: 7 }}>Rp</ThemedText>}
              suffix={
                <Feather
                  name="x"
                  size={20}
                  style={{ marginRight: 7 }}
                  onPress={() => setVisible(!visible)}
                />
              }
              style={{
                borderColor: Colors[colorScheme ?? "light"].border,
                borderWidth: 1,
              }}
            />
          )}
        </View>
      </View>
    </ModalContainer>
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
    topup: {
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-around",
      rowGap: 17,
      columnGap: 17,
    },
    balance: {
      paddingHorizontal: 17,
      height: 40,
      width: 110,
      justifyContent: "center",
      borderRadius: 10,
      borderWidth: 1,
    },
    input: { marginTop: 17, marginHorizontal: 17 },
  });

export default ModalTopup;
