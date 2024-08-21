import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { BaseLayout } from "@/components/BaseLayout";
import { ThemedText } from "@/components/ThemedText";
import { Realm, useQuery, useRealm } from "@realm/react";
import { useEffect, useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Service } from "@/schemes/ServiceScheme";
import { Cart } from "@/schemes/CartScheme";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import ServiceCardMultiple from "@/components/ServiceCardMultiple";
import ServiceCard from "@/components/ServiceCard";
import { useCartActions } from "@/services/useCartActions";
import { formatCurrency, generateTrxId } from "@/utils/helpers";
import { ThemedButton } from "@/components/ThemedButton";
import { Transaction } from "@/schemes/TransactionScheme";
import { useTransactionActions } from "@/services/useTransactionActions";
import { useToast } from "@/hooks/useToast";
import { useTransactionDetail } from "@/services/useTransactionDetailActions";
import { useTransactionLogActions } from "@/services/useTransactionLogActions";
import { useMessageActions } from "@/services/useMessageActions";
import { useThemeToggle } from "@/hooks/useThemeToggle";

interface LocalProps {
  id: number;
  title: string;
  image: any;
}

export default function FeatureScreen() {
  const { createTransaction } = useTransactionActions();
  const { createMultipleTransactionDetail } = useTransactionDetail();
  const { createTransactionLog } = useTransactionLogActions();
  const { getTotalQuantity, getTotalPrice, deleteAllByUser } = useCartActions();
  const { createMessage } = useMessageActions();
  const { id, title } = useLocalSearchParams();
  const category = Number(id);
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const { getTotalPriceByUser } = useCartActions();
  const realm = useRealm();
  const { showToast } = useToast();
  const { colorScheme } = useThemeToggle();
  const filtered = useQuery(
    {
      type: Service,
      query: (collection) => collection.filtered("category == $0", category),
    },
    [category]
  );
  const carts = useQuery(
    {
      type: Cart,
      query: (collection) =>
        collection.filtered("userId == $0 && category == $1", userId, category),
    },
    [userId, category]
  );
  const trx = useQuery(
    {
      type: Transaction,
      query: (collection) => collection.filtered("userId == $0", userId),
    },
    [userId]
  );
  // const { createMultipleServices } = useServiceActions();

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
        createMessage({
          title: "Order Awaiting Payment",
          message: `Your order with ID ${trxId} is awaiting payment of ${formatCurrency(
            getTotalPrice(category),
            "Rp"
          )}.`,
        });
        deleteAllByUser(category);
        router.replace("/(order)");
      }
      // showToast("Transaction awaiting payment", "success", "modal");
    } catch (error) {
      showToast("Something wrong, transaction is failed!", "error", "modal");
    }
  };

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(carts);
      mutableSubs.add(filtered);
      mutableSubs.add(trx);
    });
  }, [realm, carts, filtered, trx]);

  // Group services by groupId
  const groupedServices = useMemo(() => {
    return filtered.reduce((acc: any, service) => {
      const key: any = service.groupId || service._id; // Use _id as key if no groupId exists
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(service);
      return acc;
    }, {});
  }, [filtered]);

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
            height={40}
            ph={30}
            type="default"
            title="Continue"
            onPress={handleContinue}
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
});
