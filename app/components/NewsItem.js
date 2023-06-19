import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { memo, useCallback } from "react";

//scale function is used to make the ui responsive
import { scale } from "../utils/scale";
import { globalStyles } from "../utils/globalStyles";
import { colors } from "../themes/Colors";

function NewsItem(props) {
  const {
    item: {
      id,
      title,
      description,
      image,
    },
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
          style={
            [deletePinStyles.deletePinContainer, deletePinStyles.deleteColor]
            
          }
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
          source={{ uri: image }}
          style={{
            aspectRatio: 1,
            borderRadius: scale(10),
            marginRight: "0.5%",
          }}
        />
        <View
          style={styles.titleDescriptionContainer}
        >
          <Text
            style={styles.newsTitleText}
          >
            {title}
          </Text>
          <Text
            numberOfLines={7}
            style={styles.newsDescriptionText}
          >
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
  titleDescriptionContainer : {
    flex: 1,
    overflow: "hidden",
    marginLeft: "2%",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  }
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
  pinColor: { backgroundColor: colors.pinColor},
  deletePinText: { alignSelf: "center", color: colors.white },
  rightSwipeItemsContainer: { height: scale(135), marginVertical: "2%", borderRadius: scale(10) , overflow:"hidden" },
});

//For optimising flatlist performance
function arePropsEqual(prevNews, currentNews) {
    return prevNews.item.id === currentNews.item.id;
}
export default memo(NewsItem, arePropsEqual);
