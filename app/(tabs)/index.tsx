import { Image, StyleSheet, View, useColorScheme } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { BaseLayout } from "@/components/BaseLayout";
import { Colors } from "@/constants/Colors";
import { responsiveHeight, responsiveWidth } from "@/utils/sizing";
import { Input } from "@/components/Input";
import { useState } from "react";
import { AntDesign, Feather, Fontisto } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/helpers";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [search, setSearch] = useState("");

  const handleChange = (name: string, value: string) => {
    setSearch(value);
  };
  const balance = 20000;

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
        <View>
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
                {formatCurrency(balance, "Rp")},-
              </ThemedText>
            </View>
            <View
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
            </View>
          </View>
        </View>
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: "space-around" },
  header: {
    backgroundColor: Colors.warning,
    height: responsiveHeight(400),
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingHorizontal: 27,
    paddingTop: 25,
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
    height: responsiveHeight(90),
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});
