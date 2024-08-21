import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { BaseLayout } from "@/components/BaseLayout";
import { Colors } from "@/constants/Colors";
import { responsiveHeight, responsiveWidth } from "@/utils/sizing";
import { Input } from "@/components/Input";
import { useEffect, useState } from "react";
import { AntDesign, Feather, Fontisto } from "@expo/vector-icons";
import { services } from "@/constants/Constant";
import Card from "@/components/Card";
import { router } from "expo-router";
import { useModal } from "@/hooks/useModal";
import ModalImage from "@/components/ModalImage";
import ModalTopup from "@/components/ModalTopup";
import { useRealm } from "@realm/react";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useAccountActions } from "@/services/useAccountActions";
import { formatCurrency } from "@/utils/helpers";
import { Account } from "@/schemes/AccountScheme";
import { AccountLog } from "@/schemes/AccountLogScheme";
import { Message } from "@/schemes/MessageScheme";

export default function HomeScreen() {
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

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(realm.objects(Account));
      mutableSubs.add(realm.objects(AccountLog));
      mutableSubs.add(realm.objects(Message));
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
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}>
        <View style={styles.flex}>
          <ThemedText font="medium">Services Kangtukang</ThemedText>
          <View style={styles.service}>
            {services.map((item, index) => (
              <TouchableOpacity
                key={index.toString()}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/(home)/feature",
                    params: {
                      id: item.id,
                      title: item.title,
                      image: item.image,
                    },
                  })
                }
                style={styles.serviceItem}>
                <Image
                  source={item.image}
                  style={{ height: 60, width: 100 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 27 }}>
        <ThemedText font="medium">Recommend</ThemedText>
        <View style={{ marginTop: 15 }}>
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Card
              key={index.toString()}
              imageSource={require("@/assets/images/content.png")}
              title="Card Title"
              description="This is a brief description of the content inside the card. It gives an overview of what to expect."
              onReadMore={() => console.log()}
            />
          ))}
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
    marginTop: -64,
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
