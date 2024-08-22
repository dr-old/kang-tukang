import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { BaseLayout } from "@/components/BaseLayout";
import { ThemedText } from "@/components/ThemedText";
import { Realm, useQuery, useRealm } from "@realm/react";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Transaction } from "@/schemes/TransactionScheme";
import { useEffect, useMemo } from "react";
import { services } from "@/constants/Constant";
import NotFound from "@/components/NotFound";
import { router } from "expo-router";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useTransactionActions } from "@/services/useTransactionActions";
import { transactionStatus } from "@/utils/helpers";
import OrderCard from "@/components/OrderCard";

export default function OrderScreen() {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const realm = useRealm();
  const { getTransactionByUserid, getTransactionByHandymanId } =
    useTransactionActions();
  const { colorScheme } = useThemeToggle();
  const trx = useQuery(
    {
      type: Transaction,
      query: (collection) =>
        collection.filtered("userId == $0", userId).sorted("createdAt", true),
    },
    [userId]
  );

  const trxMemo = useMemo(() => {
    return profile?.role === "user"
      ? trx
      : profile?.role === "handyman"
      ? getTransactionByHandymanId(profile._id.toString())
      : [];
  }, [trx, realm, getTransactionByHandymanId, profile]);

  useEffect(() => {
    realm.subscriptions
      .update((mutableSubs) => {
        mutableSubs.add(realm.objects(Transaction));
      })
      .then(() => {
        console.log("Flexible Sync subscription created => (order)/index .");
      })
      .catch((error) => {
        console.error("Error creating subscription => (order)/index :", error);
      });
  }, [realm]);

  return (
    <BaseLayout
      lightBackgroundColor={Colors.warning}
      darkBackgroundColor={Colors.warning}
      enableScroll={true}
      statusBarStyle="dark-content">
      <View style={styles.header}>
        <ThemedText font="semiBold" type="normal">
          Orders
        </ThemedText>
      </View>
      <View
        style={{
          ...styles.order,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}>
        {trxMemo?.length > 0 ? (
          trxMemo.map((item: any, index: number) => {
            const category = services.find((i) => i.id === item.category);
            const status = transactionStatus(
              item.trxId,
              item.totalPrice,
              item.status
            );
            return (
              <OrderCard
                key={index.toString()}
                title={category?.title ?? ""}
                status={status?.title ?? ""}
                image={category?.image}
                date={item.createdAt}
                last={trxMemo.length - 1 === index}
                onPress={() => {
                  if (profile?.role === "user") {
                    router.push({
                      pathname: "/(order)/detail",
                      params: { trxId: item.trxId },
                    });
                  } else {
                    router.push({
                      pathname: "/(app)/(root)/order",
                      params: { trxId: item.trxId },
                    });
                  }
                }}
              />
            );
          })
        ) : (
          <NotFound />
        )}
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
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderImage: {
    height: 60,
    width: 70,
    resizeMode: "contain",
    marginRight: 20,
  },
});
