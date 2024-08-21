import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { AntDesign } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/helpers";
import { useThemeToggle } from "@/hooks/useThemeToggle";

interface ServiceCardProps {
  title: string;
  description?: string;
  price: number;
  qty: number;
  subtotal: number;
}

const OrderCart = ({
  title,
  description,
  price,
  qty,
  subtotal,
}: ServiceCardProps) => {
  const { colorScheme } = useThemeToggle();

  return (
    <View style={styles.orderItem}>
      <View style={{ flex: 1 }}>
        <View style={styles.orderTitle}>
          <ThemedText font="regular" type="default">
            {title}
          </ThemedText>
          <AntDesign
            name="exclamationcircleo"
            size={15}
            color={Colors[colorScheme ?? "light"].text}
            style={{ marginLeft: 10 }}
          />
        </View>
        <ThemedText font="regular" type="semiSmall">
          {description}
        </ThemedText>
      </View>
      <View style={styles.groupButton}>
        <View style={styles.button}>
          <ThemedText font="regular" type="small">
            {qty}x
          </ThemedText>
          <ThemedText font="regular" type="small">
            {formatCurrency(price, "")}
          </ThemedText>
        </View>
        <ThemedText font="medium" type="semiSmall">
          {formatCurrency(subtotal, "")}=
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    alignItems: "flex-end",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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

export default OrderCart;
