import { Platform } from "react-native";
export const fontFamily = {
  headerStyle: Platform.OS === "ios" ? "Times New Roman" : "serif",
  titleStyle: Platform.OS === "ios" ? "Times New Roman" : "serif",
  descriptionStyle: Platform.OS === "ios" ? "Times New Roman" : "serif",
  buttonStyle: Platform.OS === "ios" ? "Times New Roman" : "serif",
};
