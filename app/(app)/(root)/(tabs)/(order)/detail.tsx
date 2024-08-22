import { Image, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { BaseLayout } from "@/components/BaseLayout";
import { ThemedText } from "@/components/ThemedText";
import { Realm, useRealm } from "@realm/react";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import NotFound from "@/components/NotFound";
import Divider from "@/components/Divider";
import {
  directWhatsapp,
  formatCurrency,
  hexToRgba,
  toast,
  transactionStatus,
} from "@/utils/helpers";
import { useTransactionDetail } from "@/services/useTransactionDetailActions";
import { useAccountActions } from "@/services/useAccountActions";
import { ThemedButton } from "@/components/ThemedButton";
import { useModal } from "@/hooks/useModal";
import { useAccountLogActions } from "@/services/useAccountLogActions";
import { useMessageActions } from "@/services/useMessageActions";
import { useTransactionActions } from "@/services/useTransactionActions";
import OrderData from "@/components/OrderData";
import { CollapsibleService } from "@/components/CollapsibleService";
import Dashed from "@/components/Dashed";
import { useTransactionLogActions } from "@/services/useTransactionLogActions";
import OrderPayment from "@/components/OrderPayment";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import OrderCart from "@/components/OrderCart";
import { Transaction } from "@/schemes/TransactionScheme";
import { TransactionLog } from "@/schemes/TransactionLogScheme";
import { TransactionDetail } from "@/schemes/TransactionDetailScheme";
import OrderHistory from "@/components/OrderHistory";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@/schemes/UserScheme";
import { Service } from "@/schemes/ServiceScheme";
import ModalAlert from "@/components/ModalAlert";
import { Message } from "@/schemes/MessageScheme";
import { Account } from "@/schemes/AccountScheme";
import { AccountLog } from "@/schemes/AccountLogScheme";
import { BSON } from "realm";

export default function OrderDetailScreen() {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const { updateTransaction, getTransactionByTrxid } = useTransactionActions();
  const { getServicesByTransactionId } = useTransactionDetail();
  const { getBalanceByUserid, decrementBalance, getByUserid } =
    useAccountActions();
  const { createLog } = useAccountLogActions();
  const { createMessage } = useMessageActions();
  const { createTransactionLog, getTransactionLogByTrxid } =
    useTransactionLogActions();
  const { trxId } = useLocalSearchParams();
  const realm = useRealm();
  const { colorScheme } = useThemeToggle();
  const theme = Colors[colorScheme ?? "light"];
  const [pay, setPay] = useState(false);
  const { showModal, hideModal } = useModal();

  const trxData = useMemo(() => {
    return getTransactionByTrxid(trxId.toString());
  }, [getTransactionByTrxid, trxId]);

  const validBalance = useMemo(() => {
    return Number(getBalanceByUserid()) >= trxData.totalPrice;
  }, [getBalanceByUserid, trxData]);

  const trxStatus = useMemo(() => {
    const finded = transactionStatus(
      trxData.trxId,
      trxData.totalPrice,
      trxData.status
    );
    return finded;
  }, [transactionStatus, trxData]);

  const trxDetail = useMemo(() => {
    return getServicesByTransactionId(trxData.trxId.toString());
  }, [getServicesByTransactionId, trxData]);

  const trxLog = useMemo(() => {
    return getTransactionLogByTrxid(trxData.trxId.toString());
  }, [trxData]);

  const handlePay = () => {
    console.log(getBalanceByUserid(), trxData.totalPrice);
    try {
      decrementBalance(trxData.totalPrice);
      const data = {
        accountName: "Decrement Balance",
        accountType: 1,
        status: 1,
        balance: trxData.totalPrice,
      };
      createLog({ ...data, accountId: new BSON.ObjectId(getByUserid()?._id) });
      handleStatuses(trxData);
      updateTransaction(trxData._id.toString(), { status: 3 });
      toast("Order payment is successfull!");
    } catch (error: any) {
      console.error(error?.message);
      toast("Something wrong, order payment is failed!" || error?.message);
    } finally {
      hideModal();
    }
  };

  const handleStatuses = (trxData: { trxId: string; totalPrice: number }) => {
    const statusesToProcess = [2, 3];
    statusesToProcess.forEach((status: number) => {
      // Call the transactionStatus function with the current status
      const pay = transactionStatus(trxData.trxId, trxData.totalPrice, status);
      // Create a message based on the result
      createMessage({
        title: pay?.subtitle ?? "",
        message: pay?.message ?? "",
      });

      createTransactionLog({
        trxId,
        requesterId: userId,
        responderId: "",
        status: status,
      });
    });
  };

  useEffect(() => {
    realm.subscriptions
      .update((mutableSubs) => {
        mutableSubs.add(realm.objects(Transaction));
        mutableSubs.add(realm.objects(TransactionLog));
        mutableSubs.add(realm.objects(TransactionDetail));
        mutableSubs.add(realm.objects(User));
        mutableSubs.add(realm.objects(Service));
        mutableSubs.add(realm.objects(Message));
        mutableSubs.add(realm.objects(Account));
        mutableSubs.add(realm.objects(AccountLog));
      })
      .then(() => {
        console.log("Flexible Sync subscription created => (order)/detail.");
      })
      .catch((error) => {
        console.error("Error creating subscription => (order)/detail :", error);
      });
  }, [realm]);

  const showAlert = () => {
    showModal(
      <ModalAlert
        onConfirm={handlePay}
        message="Are you sure you want to proceed with the payment for this order?"
        title="Confirm Payment"
        labelConfirm="Yes, Pay Now"
        labelCancel="Cancel"
      />
    );
  };

  return (
    <BaseLayout
      lightBackgroundColor={Colors.warning}
      darkBackgroundColor={Colors.warning}
      enableScroll={true}
      statusBarStyle="dark-content">
      <View style={styles.header}>
        <ThemedText font="semiBold" type="normal">
          Order Detail
        </ThemedText>
      </View>

      {!trxData ? (
        <View
          style={{
            ...styles.order,
            backgroundColor: Colors[colorScheme ?? "light"].background,
          }}>
          <NotFound />
        </View>
      ) : (
        <View
          style={{
            ...styles.order,
            backgroundColor: Colors[colorScheme ?? "light"].background,
          }}>
          <OrderData
            trxData={{
              ...trxData,
              status: trxStatus!.title,
              type: trxStatus!.type,
            }}
          />
          {trxData?.handyman?._id && (
            <>
              <ThemedText font="medium" type="default">
                Responder
              </ThemedText>
              <Divider height={5} />
              <View style={styles.requester}>
                <Image
                  source={{ uri: trxData?.handyman?.photo }}
                  style={styles.requesterImage}
                />
                <View style={{ flex: 1 }}>
                  <ThemedText font="semiBold" type="default">
                    {trxData?.handyman?.name}
                  </ThemedText>
                  <ThemedText font="regular" type="semiSmall">
                    Responder
                  </ThemedText>
                  <View style={styles.rowBetween}></View>
                </View>
                {trxData.status === 4 && (
                  <Ionicons
                    name="logo-whatsapp"
                    size={24}
                    onPress={() => directWhatsapp(trxData?.handyman?.phone)}
                  />
                )}
              </View>
              <Divider height={20} />
            </>
          )}
          <ThemedText font="medium" type="default">
            History
          </ThemedText>
          {trxLog?.length > 0 &&
            trxLog.map((item: any, index: number) => {
              const finded = transactionStatus(
                item.trxId,
                Number(item.totalPrice),
                item.status
              );
              return (
                <OrderHistory
                  key={index.toString()}
                  index={index}
                  title={finded?.title ?? ""}
                  date={item.createdAt}
                />
              );
            })}
          <Divider height={20} />
          {trxDetail?.length > 0 && (
            <>
              <ThemedText font="medium" type="default">
                Details
              </ThemedText>
              <Divider height={5} />
              <CollapsibleService title="Service Details">
                {trxDetail.map((item: any, index: number) => {
                  return (
                    <OrderCart
                      key={index}
                      title={item?.service?.title}
                      description={item.description}
                      price={item.price}
                      qty={item.qty}
                      subtotal={item.subtotal}
                    />
                  );
                })}
              </CollapsibleService>
              <Divider height={20} />
            </>
          )}
          {trxData.status === 1 && (
            <OrderPayment
              borderColor={hexToRgba(Colors.info, pay ? 1 : 0.3)}
              color={pay ? Colors.info : theme.text}
              colorCheck={pay ? Colors.info : "transparent"}
              onPress={() => setPay(!pay)}
              balance={formatCurrency(Number(getBalanceByUserid()), "Rp")}
              valid={pay && !validBalance}
            />
          )}
          <ThemedText font="medium" type="default">
            Payment Details
          </ThemedText>
          <Divider height={5} />
          <View style={{ ...styles.paymentDetails, opacity: 0.5 }}>
            <ThemedText font="light" type="default">
              Total Price
            </ThemedText>
            <ThemedText type="default">
              {formatCurrency(trxData.totalPrice, "")}
            </ThemedText>
          </View>
          <View style={{ ...styles.paymentDetails, opacity: 0.5 }}>
            <ThemedText font="light" type="default">
              Service Fee
            </ThemedText>
            <ThemedText type="default">{formatCurrency(0, "")}</ThemedText>
          </View>
          <Dashed style={{ paddingVertical: 17 }} />
          <View style={styles.paymentDetails}>
            <ThemedText font="medium" type="default">
              Total
            </ThemedText>
            <ThemedText font="medium" type="default">
              {formatCurrency(trxData.totalPrice, "Rp")}
            </ThemedText>
          </View>
          <Divider height={50} />
          {trxData.status === 1 && (
            <ThemedButton
              disabled={pay && validBalance ? false : true}
              title="Confirm Payment"
              type="primary"
              onPress={showAlert}
            />
          )}
        </View>
      )}
      <Divider height={50} />
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.warning,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    paddingBottom: 70,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  order: {
    padding: 20,
    marginTop: -50,
    marginHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 20,
  },
  orderItem: {
    padding: 20,
  },
  orderImage: {
    height: 60,
    width: 70,
    resizeMode: "contain",
    marginRight: 20,
  },
  payment: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  paymentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  requester: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  requesterImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
    resizeMode: "contain",
    marginRight: 15,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
