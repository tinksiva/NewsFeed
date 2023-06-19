import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { memo, useCallback } from "react";

//scale function is used to make the ui responsive
import { scale } from "../utils/scale";
import { globalStyles } from "../utils/globalStyles";
import { colors } from "../themes/Colors";
const fallbackUrl =
  "data:image/jpeg;base64,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";

function NewsItem(props) {
  const {
    item: { id, title, description, image },
    index,
    deleteItem,
    pinItem,
    unPinItem,
    isPinned = false,
  } = props;

  //Component that displays the delete and pin options
  const deleteAndPin = useCallback(() => {
    return (
      <View style={deletePinStyles.rightSwipeItemsContainer}>
        <TouchableOpacity
          style={[
            deletePinStyles.deletePinContainer,
            deletePinStyles.deleteColor,
          ]}
          onPress={() => {
            deleteItem(id);
          }}
        >
          <Text style={deletePinStyles.deletePinText}>{"Delete"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[deletePinStyles.deletePinContainer, deletePinStyles.pinColor]}
          onPress={() => {
            if (isPinned) {
              unPinItem();
            } else {
              pinItem(id);
            }
          }}
        >
          <Text style={deletePinStyles.deletePinText}>
            {isPinned ? "UnPin" : "Pin"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, []);
  return (
    <Swipeable renderRightActions={deleteAndPin}>
      <View style={styles.container}>
        <Image
          source={{
            uri:
              image === "None"
                ? fallbackUrl
                : image,
          }}
          style={{
            aspectRatio: 1,
            height: "100%",
            borderRadius: scale(10),
            marginRight: "0.5%",
          }}
          resizeMode="contain"
        />
        <View style={styles.titleDescriptionContainer}>
          <Text style={styles.newsTitleText}>{title}</Text>
          <Text numberOfLines={7} style={styles.newsDescriptionText}>
            {description}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.elevation5,
    width: "96%",
    height: scale(135),
    marginHorizontal: "2%",
    marginVertical: "2%",
    backgroundColor: colors.white,
    paddingHorizontal: "2%",
    paddingVertical: "2%",
    borderRadius: scale(10),
    flexDirection: "row",
  },
  newsTitleText: {
    fontWeight: "700",
    fontSize: 12.5,
    flexWrap: "wrap",
    marginBottom: scale(1.5),
  },
  newsDescriptionText: {
    flexShrink: 1,
    fontSize: 11,
    color: colors.descriptionGrey,
    flexWrap: "wrap",
    textAlign: "left",
  },
  titleDescriptionContainer: {
    flex: 1,
    overflow: "hidden",
    marginLeft: "2%",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
});

const deletePinStyles = StyleSheet.create({
  deletePinContainer: {
    alignSelf: "center",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: "2%",
  },
  deleteColor: { backgroundColor: colors.deleteColor },
  pinColor: { backgroundColor: colors.pinColor },
  deletePinText: { alignSelf: "center", color: colors.white },
  rightSwipeItemsContainer: {
    height: scale(135),
    marginVertical: "2%",
    borderRadius: scale(10),
    overflow: "hidden",
  },
});

//For optimising flatlist performance
function arePropsEqual(prevNews, currentNews) {
  return prevNews.item.id === currentNews.item.id;
}
export default memo(NewsItem, arePropsEqual);
