import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { BaseLayout } from "@/components/BaseLayout";
import { Colors } from "@/constants/Colors";
import { responsiveHeight, responsiveWidth } from "@/utils/sizing";
import { Input } from "@/components/Input";
import { useEffect, useMemo, useState } from "react";
import { AntDesign, Feather, Fontisto } from "@expo/vector-icons";
import { formatCurrency, transactionStatus } from "@/utils/helpers";
import { services } from "@/constants/Constant";
import { router } from "expo-router";
import { useModal } from "@/hooks/useModal";
import ModalImage from "@/components/ModalImage";
import { useToast } from "@/hooks/useToast";
import ModalTopup from "@/components/ModalTopup";
import { Realm, useQuery, useRealm } from "@realm/react";
import { UserStoreType } from "@/utils/types";
import { useUserStore } from "@/stores/user/userStore";
import { Account } from "@/schemes/AccountScheme";
import { AccountLog } from "@/schemes/AccountLogScheme";
import { Message } from "@/schemes/MessageScheme";
import { Transaction } from "@/schemes/TransactionScheme";
import NotFound from "@/components/NotFound";
import { useTransactionActions } from "@/services/useTransactionActions";
import OrderCard from "@/components/OrderCard";
import { useThemeToggle } from "@/hooks/useThemeToggle";

export default function HomeScreen() {
  const { colorScheme } = useThemeToggle();
  const [search, setSearch] = useState("");
  const { showModal } = useModal();
  const balance = 20000;
  const { showToast } = useToast();
  const { profile } = useUserStore() as unknown as UserStoreType;
  const { getTransactionByStatus, getTransactionByStatusAndHandymanId } =
    useTransactionActions();
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const realm = useRealm();
  const account = useQuery(
    {
      type: Account,
      query: (collection) => collection.filtered("userId == $0", userId),
    },
    [userId]
  );
  const accountLog = useQuery(
    {
      type: AccountLog,
      query: (collection) => collection.filtered("userId == $0", userId),
    },
    [userId]
  );
  const message = useQuery(
    {
      type: Message,
      query: (collection) => collection.filtered("receiver == $0", userId),
    },
    [userId]
  );
  const trx = useQuery(Transaction);

  const transactionOpen = useMemo(() => {
    return getTransactionByStatus(3, true);
  }, [getTransactionByStatus]);

  const transactionMyProgress = useMemo(() => {
    return getTransactionByStatusAndHandymanId(4, userId.toString(), true);
  }, [getTransactionByStatusAndHandymanId, userId]);

  const transactionMyCompleted = useMemo(() => {
    return getTransactionByStatusAndHandymanId(5, userId.toString(), true);
  }, [getTransactionByStatusAndHandymanId, userId]);

  const showImage = () => {
    showModal(<ModalImage />);
  };

  const showTopup = () => {
    // showToast("Top-up successfully!", "success", "modal");
    showModal(<ModalTopup />);
  };

  const handleChange = (name: string, value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    showImage();
  }, []);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(account);
      mutableSubs.add(accountLog);
      mutableSubs.add(message);
      mutableSubs.add(trx);
    });
  }, [realm, account, accountLog, message, trx]);

  return (
    <BaseLayout
      lightBackgroundColor={Colors.warning}
      darkBackgroundColor={Colors.warning}
      enableScroll={true}
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
            backgroundColor: Colors[colorScheme ?? "light"].background,
          }}>
          <View style={styles.flex}>
            <ThemedText font="medium" type="semiSmall">
              Your balance
            </ThemedText>
            <ThemedText
              font="medium"
              type={balance?.toString()?.length > 9 ? "normal" : "subtitle"}>
              {formatCurrency(account[0]?.balance || 0, "Rp")},-
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
              Top-up
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      {/* transaction open */}
      <View
        style={{
          ...styles.balance,
          ...styles.serviceCard,
          marginTop: -64,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}>
        <View style={styles.flex}>
          <ThemedText font="medium">Need Handyman Now</ThemedText>
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
                  last={trx.length - 1 === index}
                  onPress={() =>
                    router.push({
                      pathname: "/(order)/detail",
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
      {/* transaction my progress */}
      <View
        style={{
          ...styles.balance,
          ...styles.serviceCard,
          marginTop: 10,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}>
        <View style={styles.flex}>
          <ThemedText font="medium">My Order Progress</ThemedText>
          {transactionMyProgress?.length > 0 ? (
            transactionMyProgress.map((item: any, index: number) => {
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
                  last={trx.length - 1 === index}
                  onPress={() =>
                    router.push({
                      pathname: "/order/detail",
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
      {/* transaction my completed */}
      <View
        style={{
          ...styles.balance,
          ...styles.serviceCard,
          marginTop: 10,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}>
        <View style={styles.flex}>
          <ThemedText font="medium">My Order Completed</ThemedText>
          {transactionMyCompleted?.length > 0 ? (
            transactionMyCompleted.map((item: any, index: number) => {
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
                  last={trx.length - 1 === index}
                  onPress={() =>
                    router.push({
                      pathname: "/order/detail",
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
    paddingHorizontal: 20,
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
});
