import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { memo } from "react";

//scale function is used to make the ui responsive
import { scale } from "../utils/scale";
import { globalStyles } from "../utils/globalStyles";
import { colors } from "../themes/Colors";

function LoadMoreButton(props) {
  const { loadMore } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={loadMore}>
      <Text style={styles.loadMoreText}>{"Load More"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.elevation5,
    width: "46%",
    height: scale(30),
    position: "absolute",
    bottom: "1%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "2%",
    marginTop: "1%",
    backgroundColor: colors.black,
    paddingHorizontal: "1%",
    paddingVertical: "1%",
    flexDirection: "row",
    borderRadius: scale(30),
  },
  loadMoreText: { textAlign: "center", color: colors.white, fontWeight: "700" },
});

export default memo(LoadMoreButton);
