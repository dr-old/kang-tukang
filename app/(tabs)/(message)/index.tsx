import { StyleSheet, View, useColorScheme } from "react-native";

import { Colors } from "@/constants/Colors";
import { BaseLayout } from "@/components/BaseLayout";
import { ThemedText } from "@/components/ThemedText";
import { Realm, useQuery, useRealm } from "@realm/react";
import { useEffect } from "react";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";
import Divider from "@/components/Divider";
import { useUserStore } from "@/stores/user/userStore";
import { UserStoreType } from "@/utils/types";
import { Message } from "@/schemes/MessageScheme";

export default function MessageScreen() {
  const realm = useRealm();
  const colorScheme = useColorScheme();
  const { profile } = useUserStore() as unknown as UserStoreType;
  const userId = new Realm.BSON.ObjectId(profile?._id);
  const message = useQuery(
    {
      type: Message,
      query: (collection) =>
        collection.filtered("receiver == $0", userId).sorted("createdAt", true),
    },
    [userId]
  );

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(message);
    });
  }, [realm, message]);

  return (
    <BaseLayout
      lightBackgroundColor={Colors.warning}
      darkBackgroundColor={Colors.warning}
      enableScroll={true}
      statusBarStyle="dark-content">
      <View style={styles.header}>
        <ThemedText font="semiBold" type="normal">
          Messages
        </ThemedText>
      </View>
      <View
        style={{
          ...styles.order,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}>
        {message.map((item: any, index: number) => {
          // const category = services.find((i) => i.id === item.category);
          return (
            <View
              key={index.toString()}
              style={{
                ...styles.orderItem,
                borderBottomColor:
                  message.length - 1 === index
                    ? "transparent"
                    : Colors.borderYellow,
              }}>
              <AntDesign
                name="exclamationcircle"
                color={Colors.warning}
                size={20}
              />
              <Divider width={18} height={0} />
              <View style={{ flex: 1 }}>
                <ThemedText font="medium" type="default">
                  {item.title}
                </ThemedText>
                <ThemedText font="regular" type="semiSmall">
                  {item.message}
                </ThemedText>
                <ThemedText font="regular" type="semiSmall">
                  {moment(item.createdAt).format("DD MMMM YYYY HH:mm")}
                </ThemedText>
              </View>
            </View>
          );
        })}
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
