import { Image, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { BaseLayout } from "@/components/BaseLayout";
import { ThemedText } from "@/components/ThemedText";
import { Realm, useQuery, useRealm } from "@realm/react";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Transaction } from "@/schemes/TransactionScheme";
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
import { useServiceActions } from "@/services/useServiceActions";
import { useAccountActions } from "@/services/useAccountActions";
import { ThemedButton } from "@/components/ThemedButton";
import { useModal } from "@/hooks/useModal";
import ModalAlert from "@/components/ModalAlert";
import { useMessageActions } from "@/services/useMessageActions";
import { useTransactionActions } from "@/services/useTransactionActions";
import OrderData from "@/components/OrderData";
import { CollapsibleService } from "@/components/CollapsibleService";
import Dashed from "@/components/Dashed";
import { useTransactionLogActions } from "@/services/useTransactionLogActions";
import OrderPayment from "@/components/OrderPayment";
import OrderHistory from "@/components/OrderHistory";
import { Ionicons } from "@expo/vector-icons";
import { useUserActions } from "@/services/useUserActions";
import OrderCart from "@/components/OrderCart";
import HeaderBack from "@/components/HeaderBack";
import { useAccountLogActions } from "@/services/useAccountLogActions";

export default function OrderDetailScreen() {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const { updateTransaction } = useTransactionActions();
  const { getTransactionDetailsByTrxId } = useTransactionDetail();
  const { getServiceById } = useServiceActions();
  const { getBalanceByUserid, topupBalance } = useAccountActions();
  const { createLog } = useAccountLogActions();
  const { createMessage } = useMessageActions();
  const { createTransactionLog, getTransactionLogByTrxid } =
    useTransactionLogActions();
  const { getUserById } = useUserActions();
  const { trxId } = useLocalSearchParams();
  const realm = useRealm();
  const { colorScheme } = useThemeToggle();
  const theme = Colors[colorScheme ?? "light"];
  const [pay, setPay] = useState(false);
  const { showModal, hideModal } = useModal();
  const trx = useQuery(
    {
      type: Transaction,
      query: (collection) => collection.filtered("trxId == $0", trxId),
    },
    [trxId]
  );
  const trxData = trx[0];
  const validBalance = Number(getBalanceByUserid()) >= trxData.totalPrice;

  const statusBadge = useMemo(() => {
    const finded = transactionStatus(
      trx[0].trxId,
      trx[0].totalPrice,
      trx[0].status
    );
    return finded;
  }, [trx]);

  const trxDetail = useMemo(() => {
    return getTransactionDetailsByTrxId(trxId.toString());
  }, [trxId]);

  const trxRequester = useMemo(() => {
    return getUserById(trxData.userId.toString());
  }, [trxData]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(trx);
      mutableSubs.add(realm.objects("Account"));
      mutableSubs.add(realm.objects("AccountLog"));
      mutableSubs.add(realm.objects("TransactionLog"));
      mutableSubs.add(realm.objects("Message"));
    });
  }, [realm, trx]);

  const handleBid = () => {
    try {
      const message = transactionStatus(trx[0].trxId, trx[0].totalPrice, 4);
      createMessage({
        title: message?.subtitle ?? "",
        message: message?.message ?? "",
        receiver: trxData.userId.toString(),
        sender: userId.toString(),
      });
      createTransactionLog({
        trxId,
        requesterId: trxData.userId,
        responderId: userId.toString(),
        status: 4,
      });
      updateTransaction(trxData._id.toString(), {
        status: 4,
        handymanId: userId.toString(),
      });
      toast("Order successfully received!");
    } catch (error: any) {
      console.error(error?.message);
      toast("Something wrong!" || error?.message);
    } finally {
      hideModal();
    }
  };

  const handleDone = () => {
    try {
      const data = {
        accountName: "Balance",
        accountType: 2,
        status: 1,
        balance: Number(trxData.totalPrice),
      };
      const newbalance = topupBalance(data);
      createLog({ ...data, accountId: newbalance._id });
      const message = transactionStatus(trx[0].trxId, trx[0].totalPrice, 5);
      createMessage({
        title: message?.subtitle ?? "",
        message: message?.message ?? "",
        receiver: trxData.userId.toString(),
        sender: userId.toString(),
      });
      createTransactionLog({
        trxId,
        requesterId: trxData.userId,
        responderId: userId.toString(),
        status: 5,
      });
      updateTransaction(trxData._id.toString(), {
        status: 5,
        handymanId: userId.toString(),
      });
      toast("Order successfully completed!");
    } catch (error: any) {
      console.error(error?.message);
      toast("Something wrong!" || error?.message);
    } finally {
      hideModal();
    }
  };

  const showAlert = () => {
    showModal(
      <ModalAlert
        onConfirm={handleBid}
        message="Are you sure you want to accept this bid?"
        title="Confirm Bid"
        labelConfirm="Yes, Accept Bid"
        labelCancel="Cancel"
      />
    );
  };

  const showDoneAlert = () => {
    showModal(
      <ModalAlert
        onConfirm={handleDone} // Function to handle marking the order as done
        message="Are you sure you want to mark this order as completed?"
        title="Order Completion"
        labelConfirm="Yes, Complete Order"
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
      <View style={styles.headerFix}>
        <HeaderBack />
      </View>
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
              status: statusBadge!.title,
              type: statusBadge?.type,
            }}
          />
          <ThemedText font="medium" type="default">
            Requested
          </ThemedText>
          <Divider height={5} />
          <View style={styles.requester}>
            <Image
              source={{ uri: profile?.photo }}
              style={styles.requesterImage}
            />
            <View style={{ flex: 1 }}>
              <ThemedText font="semiBold" type="default">
                {trxRequester?.name}
              </ThemedText>
              <ThemedText font="regular" type="semiSmall">
                Requester
              </ThemedText>
              <View style={styles.rowBetween}></View>
            </View>
            {trxData.status === 4 && (
              <Ionicons
                name="logo-whatsapp"
                size={24}
                onPress={() => directWhatsapp(trxRequester?.phone)}
              />
            )}
          </View>
          <Divider height={20} />
          <ThemedText font="medium" type="default">
            History
          </ThemedText>
          {getTransactionLogByTrxid(trxId.toString()).map(
            (item: any, index: number) => {
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
            }
          )}
          <Divider height={20} />
          <ThemedText font="medium" type="default">
            Details
          </ThemedText>
          <Divider height={5} />
          <CollapsibleService title="Service Details">
            {trxDetail.map((item: any, index: number) => {
              const service = getServiceById(item.serviceId);
              return (
                <OrderCart
                  key={index}
                  title={service!.title}
                  description={item.description}
                  price={item.price}
                  qty={item.qty}
                  subtotal={item.subtotal}
                />
              );
            })}
          </CollapsibleService>
          <Divider height={20} />
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
          {trxData.status === 3 && (
            <ThemedButton
              title={"Confirm"}
              type="primary"
              onPress={showAlert}
            />
          )}
          {trxData.status === 4 && (
            <ThemedButton
              title={"Confirm Complete"}
              type="success"
              onPress={showDoneAlert}
            />
          )}
        </View>
      )}
      <Divider height={50} />
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  headerFix: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 4,
    backgroundColor: Colors.warning,
  },
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
