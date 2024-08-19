import { Image, StyleSheet, View, useColorScheme } from "react-native";

import { Colors } from "@/constants/Colors";
import { BaseLayout } from "@/components/BaseLayout";
import { ThemedText } from "@/components/ThemedText";
import { useQuery, useRealm } from "@realm/react";
import { Service } from "@/schemes/ServiceScheme";
import { useEffect } from "react";
import { services } from "@/constants/Constant";
import moment from "moment";

export default function OrderScreen() {
  const realm = useRealm();
  const service = useQuery(Service);
  const colorScheme = useColorScheme();

  // function createService(
  //   title: string,
  //   description: string,
  //   price: number,
  //   category: number,
  //   groupId?: string
  // ) {
  //   realm.write(() => {
  //     return realm.create(Service, {
  //       title,
  //       description,
  //       price,
  //       category,
  //       groupId: groupId || "",
  //     });
  //   });
  // }

  // async function handleCreate() {
  //   try {
  //     createService(
  //       "Daily Repairman",
  //       "General maintenance and repair services.",
  //       70000,
  //       1
  //     );
  //     createService(
  //       "Plumbing Fix",
  //       "Fixing and installing pipes and plumbing systems.",
  //       50000,
  //       2
  //     );
  //     createService(
  //       "Electrical Services",
  //       "Electrical repairs and installations.",
  //       75000,
  //       3
  //     );
  //     createService(
  //       "Gardening",
  //       "Lawn care, gardening, and landscaping services.",
  //       20000,
  //       1
  //     );
  //     createService(
  //       "Cleaning Services",
  //       "Professional cleaning services for homes and offices.",
  //       30000,
  //       2
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // function insertSpecificServices() {
  //   createService(
  //     "Daily Repairman",
  //     "General maintenance and repair services.",
  //     70000,
  //     1
  //   );
  //   createService(
  //     "Plumbing Fix",
  //     "Fixing and installing pipes and plumbing systems.",
  //     50000,
  //     2
  //   );
  //   createService(
  //     "Electrical Services",
  //     "Electrical repairs and installations.",
  //     75000,
  //     3
  //   );
  //   createService(
  //     "Gardening",
  //     "Lawn care, gardening, and landscaping services.",
  //     20000,
  //     1
  //   );
  //   createService(
  //     "Cleaning Services",
  //     "Professional cleaning services for homes and offices.",
  //     30000,
  //     2
  //   );
  // }

  // console.log("service", service);

  // // useEffect(() => {
  // //   insertSpecificServices();
  // // }, []);

  useEffect(() => {
    if (realm) {
      realm.subscriptions
        .update((mutableSubs) => {
          mutableSubs.add(realm.objects("Service"));
        })
        .then(() => {
          console.log("Flexible Sync subscription created.");
        })
        .catch((error) => {
          console.error("Error creating subscription:", error);
        });
    }
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
        {service.map((item: any, index: number) => {
          const category = services.find((i) => i.id === item.category);
          return (
            <View
              key={index.toString()}
              style={{
                ...styles.orderItem,
                borderBottomColor:
                  service.length - 1 === index
                    ? "transparent"
                    : Colors.borderYellow,
              }}>
              <Image source={category?.image} style={styles.orderImage} />
              <View style={{ flex: 1 }}>
                <ThemedText font="medium" type="default">
                  {category?.title}
                </ThemedText>
                <ThemedText font="regular" type="semiSmall">
                  {category?.title}
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
