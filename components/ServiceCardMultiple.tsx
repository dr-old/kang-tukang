import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { AntDesign } from "@expo/vector-icons";
import { useCartActions } from "@/services/useCartActions";
import { useThemeToggle } from "@/hooks/useThemeToggle";

interface ServiceCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: number;
  border?: string;
}

const ServiceCardMultiple = ({
  id,
  title,
  description,
  price,
  category,
  border,
}: ServiceCardProps) => {
  const { addToCart, incrementQuantity, decrementQuantity, getQuantity } =
    useCartActions();
  const { colorScheme } = useThemeToggle();

  return (
    <View style={{ ...styles.orderItemMultiple, borderBottomColor: border }}>
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
      {getQuantity(id) > 0 ? (
        <View style={styles.groupButton}>
          <View style={styles.button}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => decrementQuantity(id)}
              style={{
                ...styles.iconButton,
                backgroundColor: Colors.info,
              }}>
              <AntDesign name="minus" size={15} color={Colors.white} />
            </TouchableOpacity>
            <ThemedText font="regular">{getQuantity(id)}</ThemedText>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => incrementQuantity(id)}
              style={{
                ...styles.iconButton,
                backgroundColor: Colors.warning,
              }}>
              <AntDesign name="plus" size={15} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <ThemedText font="regular" type="small" textAlign="center">
            /Jasa
          </ThemedText>
        </View>
      ) : (
        <View style={{ ...styles.groupButton, alignItems: "flex-end" }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              addToCart({
                _id: id,
                title,
                description,
                notes: "",
                price,
                category,
              })
            }
            style={styles.buttonCircle}>
            <AntDesign name="plus" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderItemMultiple: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  orderTitle: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 5,
    marginRight: 10,
  },
  groupButton: {
    width: 90,
    marginLeft: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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

export default ServiceCardMultiple;
