import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { BaseLayout } from "@/components/BaseLayout";
import { ThemedText } from "@/components/ThemedText";
import { Realm, useQuery, useRealm } from "@realm/react";
import { router, useLocalSearchParams } from "expo-router";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import ServiceCardMultiple from "@/components/ServiceCardMultiple";
import { useCartActions } from "@/services/useCartActions";
import {
  formatCurrency,
  generateTrxId,
  toast,
  transactionStatus,
} from "@/utils/helpers";
import { useTransactionActions } from "@/services/useTransactionActions";
import { useTransactionDetail } from "@/services/useTransactionDetailActions";
import { useTransactionLogActions } from "@/services/useTransactionLogActions";
import { useMessageActions } from "@/services/useMessageActions";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useServiceActions } from "@/services/useServiceActions";
import { useEffect, useMemo } from "react";
import { Service } from "@/schemes/ServiceScheme";
import { Cart } from "@/schemes/CartScheme";
import ServiceCard from "@/components/ServiceCard";
import { ThemedButton } from "@/components/ThemedButton";
import ModalAlert from "@/components/ModalAlert";
import { useModal } from "@/hooks/useModal";
import { Transaction } from "@/schemes/TransactionScheme";
import { TransactionLog } from "@/schemes/TransactionLogScheme";
import { TransactionDetail } from "@/schemes/TransactionDetailScheme";

export default function FeatureScreen() {
  const { createTransaction } = useTransactionActions();
  const { createMultipleTransactionDetail } = useTransactionDetail();
  const { createTransactionLog } = useTransactionLogActions();
  const { getTotalQuantity, getTotalPrice, deleteAllByUser } = useCartActions();
  const { createMessage } = useMessageActions();
  const { getServiceByCategory } = useServiceActions();
  const { id, title } = useLocalSearchParams();
  const category = Number(id);
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const { getTotalPriceByUser } = useCartActions();
  const realm = useRealm();
  const { showModal, hideModal } = useModal();
  const { colorScheme } = useThemeToggle();
  const carts = useQuery(
    {
      type: Cart,
      query: (collection) =>
        collection.filtered("category == $0 && userId == $1", category, userId),
    },
    [category, userId]
  );

  const handleContinue = () => {
    try {
      const trxId = generateTrxId();
      const newTransaction = {
        trxId,
        totalPrice: getTotalPrice(category),
        totalQty: getTotalQuantity(category),
        description: "Purchase of items",
        category: carts[0].category,
      };
      const newTrx = createTransaction(newTransaction);
      const trxDetail = carts.map((item) => ({
        trxId,
        serviceId: item.serviceId,
        qty: item.qty,
        price: item.price,
        subtotal: Number(item.price) * item.qty,
        description: item.description,
      }));
      const newTrxDetail = createMultipleTransactionDetail(trxDetail);
      const newTrxLog = createTransactionLog({
        trxId,
        requesterId: userId,
        responderId: "",
        status: 1,
      });
      if (newTrx && newTrxDetail && newTrxLog) {
        const message = transactionStatus(trxId, getTotalPrice(category), 1);
        createMessage({
          title: message?.subtitle ?? "",
          message: message?.message ?? "",
        });
        deleteAllByUser(category);
        router.push("/(app)/(order)");
        toast("Please continue to payment order!");
      }
    } catch (error: any) {
      toast(error?.message || "Something wrong, transaction is failed!");
    } finally {
      hideModal();
    }
  };

  const showAlert = () => {
    showModal(
      <ModalAlert
        onConfirm={handleContinue}
        message="Are you sure you want to continue this order?"
        title="Confirm Continue"
        labelConfirm="Yes, Confirm"
        labelCancel="Cancel"
      />
    );
  };

  // // Group services by groupId
  const groupedServices = useMemo(() => {
    return getServiceByCategory(Number(id)).reduce((acc: any, service) => {
      const key: any = service.groupId || service._id; // Use _id as key if no groupId exists
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(service);
      return acc;
    }, {});
  }, [getServiceByCategory, id, carts]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(realm.objects(Service));
      mutableSubs.add(realm.objects(Cart));
      mutableSubs.add(realm.objects(Transaction));
      mutableSubs.add(realm.objects(TransactionLog));
      mutableSubs.add(realm.objects(TransactionDetail));
    });
  }, [realm]);

  // Render merged or individual cards
  const renderMergedCard = (groupedServices: any) => {
    return Object.values(groupedServices).map((group: any, index) => {
      if (group.length > 1) {
        return (
          <View key={index} style={styles.group}>
            <ThemedText font="regular" type="default" style={styles.groupTitle}>
              {group[0].groupId}
            </ThemedText>
            <View style={styles.grouping}>
              {group.map((i: any, idx: number) => (
                <ServiceCardMultiple
                  key={`group_${idx}`}
                  title={i.title}
                  id={i._id}
                  description={i.description}
                  price={i.price}
                  border={
                    group.length - 1 === idx
                      ? "transparent"
                      : Colors.borderYellow
                  }
                  category={i.category}
                />
              ))}
            </View>
          </View>
        );
      } else if (group.length === 1) {
        const service = group[0];
        return (
          <ServiceCard
            key={index}
            id={service._id}
            title={service.title}
            description={service.description}
            price={service.price}
            category={service.category}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <BaseLayout
      lightBackgroundColor={Colors.warning}
      darkBackgroundColor={Colors.warning}
      enableScroll={true}
      statusBarStyle="dark-content">
      <View style={styles.header}>
        <ThemedText font="semiBold" type="normal">
          {title}
        </ThemedText>
      </View>
      <View
        style={{
          ...styles.order,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}>
        {renderMergedCard(groupedServices)}
        <View style={styles.payment}>
          <View style={{ flex: 1 }}>
            <ThemedText type="semiSmall" font="medium">
              Total Payment
            </ThemedText>
            <ThemedText
              type={
                getTotalPriceByUser(category).toString.length > 10
                  ? "normal"
                  : "subtitle"
              }
              font={"medium"}>
              {formatCurrency(getTotalPriceByUser(category), "Rp")}
            </ThemedText>
          </View>
          <ThemedButton
            disabled={carts?.length > 0 ? false : true}
            height={40}
            ph={30}
            type="default"
            title="Continue"
            onPress={showAlert}
          />
        </View>
      </View>
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
  order: {
    marginTop: -50,
    marginBottom: 50,
    paddingVertical: 24,
    marginHorizontal: 17,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 20,
  },
  group: {
    marginHorizontal: 17,
  },
  grouping: {
    borderWidth: 1,
    borderColor: Colors.borderYellow,
    marginBottom: 20,
    borderRadius: 10,
  },
  groupTitle: { paddingHorizontal: 10, paddingBottom: 5 },
  payment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.warning,
    marginHorizontal: 17,
    paddingHorizontal: 17,
    height: 100,
    borderRadius: 20,
  },

  // service card
  orderItem: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 17,
    marginBottom: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderYellow,
  },
  orderTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  groupButton: {
    width: 90,
    marginLeft: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  iconButton: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonCircle: {
    backgroundColor: Colors.info,
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
