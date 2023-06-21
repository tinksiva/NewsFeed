import { StyleSheet } from "react-native";
import { colors } from "../themes/Colors";

export const globalStyles = StyleSheet.create({
  elevation5: {
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  flex1: {
    flex: 1,
    backgroundColor: colors.transparent,
  },
});