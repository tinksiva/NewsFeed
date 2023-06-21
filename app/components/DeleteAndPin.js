import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { memo, useCallback } from "react";

//scale function is used to make the ui responsive
import { scale, scaleFont } from "../utils/scale";
import { colors } from "../themes/Colors";

function DeleteAndPin(props) {
  const {
    id,
    deleteItem,
    pinItem,
    unPinItem,
    isPinned = false,
  } = props;

  //Component that displays the delete and pin options
  const pinUnpin = useCallback(() => {
    if (isPinned) {
      unPinItem();
    } else {
      pinItem(id);
    }
  }, [])
  const deleteNews = useCallback(() => {
    deleteItem(id, isPinned);
  }, [])
  return (
    <View style={deletePinStyles.rightSwipeItemsContainer}>
        <TouchableOpacity
          style={[
            deletePinStyles.deletePinContainer,
            deletePinStyles.deleteColor,
          ]}
          onPress={deleteNews}
        >
          <Text style={deletePinStyles.deletePinText}>{"Delete"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[deletePinStyles.deletePinContainer, deletePinStyles.pinColor]}
          onPress={pinUnpin}
        >
          <Text style={deletePinStyles.deletePinText}>
            {isPinned ? "UnPin" : "Pin"}
          </Text>
        </TouchableOpacity>
      </View>
  );
}



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

export default memo(DeleteAndPin);
