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
import { Ionicons } from "@expo/vector-icons";
import { ThemedButton } from "@/components/ThemedButton";
import { useModal } from "@/hooks/useModal";
import ModalAlert from "@/components/ModalAlert";
import { useAccountLogActions } from "@/services/useAccountLogActions";
import { BSON } from "realm";
import { useMessageActions } from "@/services/useMessageActions";
import { useTransactionActions } from "@/services/useTransactionActions";
import OrderData from "@/components/OrderData";
import { CollapsibleService } from "@/components/CollapsibleService";
import Dashed from "@/components/Dashed";
import { useTransactionLogActions } from "@/services/useTransactionLogActions";
import OrderPayment from "@/components/OrderPayment";
import OrderCart from "@/components/OrderCart";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useUserActions } from "@/services/useUserActions";
import OrderHistory from "@/components/OrderHistory";

export default function OrderDetailScreen() {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const { updateTransaction } = useTransactionActions();
  const { getTransactionDetailsByTrxId } = useTransactionDetail();
  const { getServiceById } = useServiceActions();
  const { getBalanceByUserid, decrementBalance, getByUserid } =
    useAccountActions();
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
    return trxData?.handymanId && getUserById(trxData?.handymanId?.toString());
  }, [trxData]);

  const trxLog = useMemo(() => {
    return getTransactionLogByTrxid(trxId.toString());
  }, [trxId]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(trx);
      mutableSubs.add(realm.objects("Account"));
      mutableSubs.add(realm.objects("AccountLog"));
      mutableSubs.add(realm.objects("TransactionLog"));
      mutableSubs.add(realm.objects("Message"));
    });
  }, [realm, trx]);

  const handlePay = () => {
    // console.log(getBalanceByUserid(), trxData.totalPrice);
    try {
      decrementBalance(trxData.totalPrice);
      const data = {
        accountName: "Decrement Balance",
        accountType: 1,
        status: 1,
        balance: trxData.totalPrice,
      };
      createLog({ ...data, accountId: new BSON.ObjectId(getByUserid()?._id) });
      createMessage({
        title: "Yeah, Order Payment Successful",
        message: `Your order has been successfully pay with ${formatCurrency(
          trxData.totalPrice,
          "Rp"
        )} for main balance.`,
      });
      createTransactionLog({
        trxId,
        requesterId: userId,
        responderId: "",
        status: 3,
      });
      updateTransaction(trxData._id.toString(), { status: 3 });
      toast("Order payment is successfull!");
    } catch (error: any) {
      console.error(error?.message);
      toast("Something wrong, order payment is failed!" || error?.message);
    } finally {
      hideModal();
    }
  };

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
              status: statusBadge!.title,
              type: statusBadge?.type,
            }}
          />
          {trxRequester && (
            <>
              <ThemedText font="medium" type="default">
                Responder
              </ThemedText>
              <Divider height={5} />
              <View style={styles.requester}>
                <Image
                  source={{ uri: trxRequester?.photo }}
                  style={styles.requesterImage}
                />
                <View style={{ flex: 1 }}>
                  <ThemedText font="semiBold" type="default">
                    {trxRequester?.name}
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
                    onPress={() => directWhatsapp(trxRequester?.phone)}
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
