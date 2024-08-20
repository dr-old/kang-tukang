import { Colors } from "@/constants/Colors";
import { hexToRgba } from "@/utils/helpers";
import React from "react";
import { View, StyleSheet, Dimensions, ViewStyle } from "react-native";

interface DashedProps {
  width?: number; // Optional width parameter
  style?: ViewStyle;
}

const Dashed: React.FC<DashedProps> = ({ width, style }) => {
  const screenWidth = Dimensions.get("window").width; // Get the screen width
  const containerWidth = width || screenWidth; // Use custom width if provided, else screen width

  // Calculate the number of dashes that can fit in the width
  const dashLength = 12.5;
  const dashSpacing = 5;
  const totalDashLength = dashLength + dashSpacing;
  const numberOfDashes = Math.floor(containerWidth / totalDashLength);

  return (
    <View style={styles.container}>
      <View style={[styles.dashedLineContainer, style]}>
        {Array.from({ length: numberOfDashes }).map((_, index) => (
          <View
            key={index.toString()}
            style={[styles.dash, styles.shortDash]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  dashedLineContainer: {
    flexDirection: "row",
  },
  dash: {
    height: 2, // Thickness of the dash
    backgroundColor: hexToRgba(Colors.black, 0.3), // Color of the dash
  },
  longDash: {
    width: 20, // Length of the long dash
  },
  shortDash: {
    width: 10, // Length of the short dash
    marginLeft: 5, // Space between dashes
  },
});

export default Dashed;
