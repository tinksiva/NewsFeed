import { StyleSheet, Platform } from "react-native";

//scale function is used to make the ui responsive
import { scale, scaleFont } from "../../utils/scale";

import { colors } from "../../themes/Colors";
import { fontFamily } from "../../themes/FontFamily";
export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.appBackgroundColor,
    paddingBottom: "1%",
    flex: 1,
  },
  innerElementsContainer: { paddingHorizontal: "2%", flex: 1 },
  newLisContainer: { flex: 1, marginBottom: "15%" },
  headLineText: {
    textAlign: "center",
    color: colors.white,
    fontWeight: "bold",
    fontFamily: fontFamily.headerStyle,
    fontSize: scaleFont(18),
    marginTop: scale(28),
  },
  headerContainer: {
    height: "8%",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.black,
  },
  emptyComponentStyles: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  emptyText: { textAlign: "center" },
});
