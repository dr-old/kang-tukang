import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { hexToRgba } from "@/utils/helpers";

interface CardProps {
  imageSource: any;
  title: string;
  description: string;
  onReadMore: () => void;
}

const Card: React.FC<CardProps> = ({
  imageSource,
  title,
  description,
  onReadMore,
}) => {
  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.content}>
        <ThemedText font="semiBold" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText font="regular" type="semiSmall">
          {description}
        </ThemedText>
        <TouchableOpacity onPress={onReadMore}>
          <ThemedText font="medium" type="semiSmall">
            Read More
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderBottomColor: hexToRgba(Colors.border, 0.3),
    overflow: "hidden",
    paddingBottom: 8,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3.84,
    // elevation: 5,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
    borderRadius: 20,
  },
  content: {
    paddingTop: 8,
  },
  title: {
    // marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  readMoreButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007BFF",
    borderRadius: 4,
  },
  readMoreText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Card;
