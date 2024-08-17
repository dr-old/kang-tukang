import { Dimensions, PixelRatio, Platform } from "react-native";

// Get the device's screen dimensions
const { width, height } = Dimensions.get("window");

// iOS and Android guideline base dimensions
const guidelineBaseWidthIOS = 375; // iPhone 11 Pro, 12, 13
const guidelineBaseHeightIOS = 812; // iPhone 11 Pro, 12, 13

const guidelineBaseWidthAndroid = 360; // Google Pixel 4, Samsung Galaxy S10
const guidelineBaseHeightAndroid = 760; // Google Pixel 4, Samsung Galaxy S10

// Select appropriate guideline based on platform
const guidelineBaseWidth =
  Platform.OS === "ios" ? guidelineBaseWidthIOS : guidelineBaseWidthAndroid;
const guidelineBaseHeight =
  Platform.OS === "ios" ? guidelineBaseHeightIOS : guidelineBaseHeightAndroid;

// Responsive Width Calculation
export const responsiveWidth = (size: number) =>
  (width / guidelineBaseWidth) * size;

// Responsive Height Calculation
export const responsiveHeight = (size: number) =>
  (height / guidelineBaseHeight) * size;

// Responsive Font Size Calculation
export const responsiveFontSize = (size: number) =>
  size * PixelRatio.getFontScale();

// Convert width percentage to DP
export const widthPercentageToDP = (percentage: number) => {
  const value = (percentage * width) / 100;
  return Math.round(value);
};

// Convert height percentage to DP
export const heightPercentageToDP = (percentage: number) => {
  const value = (percentage * height) / 100;
  return Math.round(value);
};

// Example usage:
// responsiveWidth(100), responsiveHeight(50), responsiveFontSize(16)
// widthPercentageToDP('50%'), heightPercentageToDP('30%')
