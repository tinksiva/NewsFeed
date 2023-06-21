import { StyleSheet, Text, View } from "react-native";
import { memo } from "react";

function EmptyList(props) {
  const { error } = props;
  //Displays when the list is empty either while fetching or due to an error
  return (
    <View style={styles.emptyComponentStyles}>
      <Text style={styles.emptyText}>
        {error
          ? "Looks like something is wrong. Please try again after sometime"
          : "Please Wait while we fetch the latest news for you"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyComponentStyles: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "60%",
    height: "100%",
    flex: 1,
  },
  emptyText: { textAlign: "center", alignSelf: "center" },
});

export default memo(EmptyList);
