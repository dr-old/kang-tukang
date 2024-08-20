import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { formatCurrency } from "@/utils/helpers";
import Divider from "./Divider";
import moment from "moment";
import { ThemedBadge } from "./ThemedBadge";

interface CardProps {
  trxData: any;
}

const OrderData: React.FC<CardProps> = ({ trxData }) => {
  return (
    <View>
      <ThemedText font="regular" type="semiSmall">
        Transaction Number
      </ThemedText>
      <ThemedText font="medium" type="default">
        {trxData.trxId}
      </ThemedText>
      <Divider height={5} />
      <ThemedText font="regular" type="semiSmall">
        Date
      </ThemedText>
      <ThemedText font="medium" type="default">
        {moment(trxData.createdAt).format("DD MMMM YYYY HH:mm")}
      </ThemedText>
      <Divider height={5} />
      <ThemedText font="regular" type="semiSmall">
        Status
      </ThemedText>
      <ThemedBadge title={trxData.status} type={trxData.type} />
      <Divider height={5} />
      <ThemedText font="regular" type="semiSmall">
        Notes
      </ThemedText>
      <ThemedText font="medium" type="default">
        {trxData.description}
      </ThemedText>
      <Divider height={5} />
      <ThemedText font="regular" type="semiSmall">
        Total Price
      </ThemedText>
      <ThemedText font="medium" type="default">
        {formatCurrency(trxData.totalPrice, "Rp")}
      </ThemedText>
      <Divider height={20} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default OrderData;
