import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { BaseLayout } from "@/components/BaseLayout";
import { Colors } from "@/constants/Colors";
import { responsiveHeight, responsiveWidth } from "@/utils/sizing";
import { Input } from "@/components/Input";
import { useEffect, useMemo, useState } from "react";
import { AntDesign, Feather, Fontisto } from "@expo/vector-icons";
import { services } from "@/constants/Constant";
import { Redirect, router } from "expo-router";
import { useModal } from "@/hooks/useModal";
import ModalImage from "@/components/ModalImage";
import ModalTopup from "@/components/ModalTopup";
import { useRealm } from "@realm/react";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useAccountActions } from "@/services/useAccountActions";
import { formatCurrency, transactionStatus } from "@/utils/helpers";
import { UserStoreType } from "@/utils/types";
import { useUserStore } from "@/stores/user/userStore";
import { Transaction } from "@/schemes/TransactionScheme";
import { useTransactionActions } from "@/services/useTransactionActions";
import OrderCard from "@/components/OrderCard";
import NotFound from "@/components/NotFound";

export default function HandymanScreen() {
  const { profile, isLoggedIn } = useUserStore() as unknown as UserStoreType;

  if (isLoggedIn && profile?.role === "user") {
    return <Redirect href="/(app)/(home)" />;
  }
  const { getTransactionByHandymanId, getTransactionByStatus } =
    useTransactionActions();
  const { colorScheme } = useThemeToggle();
  const [search, setSearch] = useState("");
  const { showModal } = useModal();
  const balance = 20000;
  const { getBalanceByUserid } = useAccountActions();
  const realm = useRealm();

  const showImage = () => {
    showModal(<ModalImage />);
  };

  const showTopup = () => {
    showModal(<ModalTopup />);
  };

  const handleChange = (name: string, value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    showImage();
  }, []);

  const transactionOpen = useMemo(() => {
    return getTransactionByStatus(3, true);
  }, [getTransactionByStatus]);

  function sortTransactionsByStatusAsc(
    transactions: Record<string, any[]>
  ): Record<string, any[]> {
    // Convert the keys to an array and sort them as numbers in ascending order
    const sortedKeys = Object.keys(transactions).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    // Reconstruct the sorted object
    const sortedTransactions: Record<string, any[]> = {};
    sortedKeys.forEach((key) => {
      sortedTransactions[key] = transactions[key];
    });

    return sortedTransactions;
  }

  const groupedStatus = useMemo(() => {
    const trx = getTransactionByHandymanId(profile!._id.toString()).reduce(
      (acc: any, trx) => {
        const key: any = trx.status; // Use _id as key if no groupId exists
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(trx);
        return acc;
      },
      {}
    );
    return sortTransactionsByStatusAsc(trx);
  }, [getTransactionByHandymanId, sortTransactionsByStatusAsc, profile]);

  const renderMergedCard = (groupedServices: any) => {
    return Object.values(groupedServices).map((group: any, index) => {
      let title = "";
      if (group[0].status === 4) {
        title = "My Order In Progress";
      } else if (group[0].status === 5) {
        title = "My Order Completed";
      }

      return (
        <View
          key={index.toString()}
          style={{
            ...styles.balance,
            ...styles.serviceCard,
            backgroundColor: Colors[colorScheme ?? "light"].background,
          }}>
          <View style={styles.flex}>
            <ThemedText font="medium" style={{ paddingHorizontal: 20 }}>
              {title}
            </ThemedText>
            {group?.length > 0 ? (
              group.map((item: any, index: number) => {
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
                    last={group.length - 1 === index}
                    onPress={() =>
                      router.push({
                        pathname: "/(app)/(root)/order",
                        params: { trxId: item.trxId },
                      })
                    }
                  />
                );
              })
            ) : (
              <NotFound ph={0} enableIcon={false} />
            )}
          </View>
        </View>
      );
    });
  };

  useEffect(() => {
    realm.subscriptions
      .update((mutableSubs) => {
        mutableSubs.add(realm.objects(Transaction));
      })
      .then(() => {
        console.log("Flexible Sync subscription created => (home)/handyman .");
      })
      .catch((error) => {
        console.error(
          "Error creating subscription => (home)/handyman :",
          error
        );
      });
  }, [realm]);

  return (
    <BaseLayout
      lightBackgroundColor={Colors.warning}
      darkBackgroundColor={Colors.warning}
      enableScroll={true}
      enableHeader={true}
      statusBarStyle="dark-content">
      <View style={styles.header}>
        <ThemedText font="medium" type="normal">
          Welcome to Kangtukang
          <Image
            source={require("@/assets/images/Palu.png")}
            style={styles.hammer}
          />
        </ThemedText>
        <ThemedText font="light" type="default" style={{ marginBottom: 25 }}>
          Solutions to all your problems and complaints
        </ThemedText>
        <Input
          name="search"
          labelOff={true}
          value={search}
          onChange={handleChange}
          onBlur={() => console.log()}
          placeholder="Your location"
          radius={20}
          preffix={
            <Fontisto
              name={"map-marker-alt"}
              color={Colors.orange}
              size={24}
              style={{ marginLeft: 16 }}
            />
          }
          suffix={
            <Feather
              name={"search"}
              color={Colors.black}
              size={24}
              style={{ marginRight: 16 }}
            />
          }
        />
        <View
          style={{
            ...styles.balance,
            paddingHorizontal: 20,
            backgroundColor: Colors[colorScheme ?? "light"].background,
          }}>
          <View style={styles.flex}>
            <ThemedText font="medium" type="semiSmall">
              Saldo tersisa
            </ThemedText>
            <ThemedText
              font="medium"
              type={balance?.toString()?.length > 9 ? "normal" : "subtitle"}>
              {formatCurrency(getBalanceByUserid() || 0, "Rp")},-
            </ThemedText>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={showTopup}
            style={{
              ...styles.topup,
              borderColor: Colors[colorScheme ?? "light"].border,
            }}>
            <AntDesign
              name={"plussquare"}
              color={Colors.black}
              size={24}
              style={{ marginRight: 10 }}
            />
            <ThemedText font="medium" type="semiSmall">
              Isi Saldo
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          ...styles.balance,
          ...styles.serviceCard,
          marginTop: -60,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}>
        <View style={styles.flex}>
          <ThemedText font="medium" style={{ paddingHorizontal: 20 }}>
            Need Handyman Now
          </ThemedText>
          {transactionOpen?.length > 0 ? (
            transactionOpen.map((item: any, index: number) => {
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
                  last={transactionOpen.length - 1 === index}
                  onPress={() =>
                    router.push({
                      pathname: "/(app)/(root)/order",
                      params: { trxId: item.trxId },
                    })
                  }
                />
              );
            })
          ) : (
            <NotFound ph={0} enableIcon={false} />
          )}
        </View>
      </View>
      {renderMergedCard(groupedStatus)}
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: "space-around" },
  header: {
    backgroundColor: Colors.warning,
    height: responsiveHeight(320),
    overflow: "hidden",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingHorizontal: 27,
    paddingTop: 25,
    position: "relative",
  },
  hammer: { width: responsiveWidth(25), height: responsiveHeight(25) },
  topup: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  balance: {
    minHeight: responsiveHeight(90),
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    marginBottom: 16,
  },
  serviceCard: {
    marginHorizontal: 27,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  service: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  serviceItem: {
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
    flex: 1,
  },
  serviceText: { marginBottom: 10 },
});
