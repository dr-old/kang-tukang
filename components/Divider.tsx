import React from "react";
import { View, ViewStyle } from "react-native";

interface DividerProps {
  height: number;
  width?: any;
  bgColor?: string;
  mTop?: number;
  mBot?: number;
  mLeft?: number;
  mRight?: number;
}

function Divider({
  height,
  width,
  bgColor,
  mTop,
  mBot,
  mLeft,
  mRight,
}: DividerProps) {
  const dividerStyle: ViewStyle = {
    marginTop: mTop,
    marginBottom: mBot,
    marginLeft: mLeft,
    marginRight: mRight,
    height,
    width: width || "100%",
    backgroundColor: bgColor || "transparent",
  };

  return <View style={dividerStyle} />;
}

export default Divider;
