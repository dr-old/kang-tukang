import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import moment from "moment";

interface ServiceCardProps {
  title: string;
  image: any;
  status: string;
  date: string;
  onPress: () => void;
  last?: boolean;
}

const OrderCard = ({
  title,
  image,
  status,
  date,
  onPress,
  last,
}: ServiceCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.orderItem,
        borderBottomColor: last ? "transparent" : Colors.borderYellow,
      }}>
      {image && <Image source={image} style={styles.orderImage} />}
      <View style={{ flex: 1 }}>
        <ThemedText font="medium" type="default">
          {title}
        </ThemedText>
        <ThemedText font="regular" type="semiSmall">
          {status}
        </ThemedText>
        <ThemedText font="regular" type="semiSmall">
          {moment(date).format("DD MMMM YYYY HH:mm")}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default OrderCard;
