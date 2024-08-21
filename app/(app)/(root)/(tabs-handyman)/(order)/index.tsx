import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { BaseLayout } from "@/components/BaseLayout";
import { ThemedText } from "@/components/ThemedText";
import { Realm, useQuery, useRealm } from "@realm/react";
import moment from "moment";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Transaction } from "@/schemes/TransactionScheme";
import { useEffect } from "react";
import { services } from "@/constants/Constant";
import NotFound from "@/components/NotFound";
import { router } from "expo-router";
import { transactionStatus } from "@/utils/helpers";
import { useThemeToggle } from "@/hooks/useThemeToggle";

export default function OrderScreen() {
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const realm = useRealm();
  const { colorScheme } = useThemeToggle();
  const trx = useQuery(
    {
      type: Transaction,
      query: (collection) =>
        collection
          .filtered("handymanId == $0", userId.toString())
          .sorted("createdAt", true),
    },
    [userId]
  );

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(trx);
    });
  }, [realm, trx]);

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
        {trx?.length > 0 ? (
          trx.map((item: any, index: number) => {
            const category = services.find((i) => i.id === item.category);
            const status = transactionStatus(
              item.trxId,
              item.totalPrice,
              item.status
            );
            return (
              <TouchableOpacity
                key={index.toString()}
                onPress={() =>
                  router.push({
                    pathname: "/order/detail",
                    params: { trxId: item.trxId },
                  })
                }
                style={{
                  ...styles.orderItem,
                  borderBottomColor:
                    trx.length - 1 === index
                      ? "transparent"
                      : Colors.borderYellow,
                }}>
                <Image source={category?.image} style={styles.orderImage} />
                <View style={{ flex: 1 }}>
                  <ThemedText font="medium" type="default">
                    {category?.title}
                  </ThemedText>
                  <ThemedText font="regular" type="semiSmall">
                    {status?.title}
                  </ThemedText>
                  <ThemedText font="regular" type="semiSmall">
                    {moment(item.createdAt).format("DD MMMM YYYY HH:mm")}
                  </ThemedText>
                </View>
              </TouchableOpacity>
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
