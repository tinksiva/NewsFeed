import { Text, View, FlatList } from "react-native";
import { useCallback } from "react";
//Custom Hooks
import { useCustomHookForNewsFeed } from "./hooks";

//Component Imports
import NewsItem from "../../components/NewsItem";
import EmptyList from "../../components/EmptyList";

//scale function is used to make the ui responsive
import { styles } from "./styles";
import { scale } from "../../utils/scale";
import { globalStyles } from "../../utils/globalStyles";

export default function NewsFeed(props) {
  const {
    feed,
    pinnedElement,
    showLoadMore,
    error,
    refreshing,
    pinItem,
    unPinItem,
    deleteItem,
    loadMore,
  } = useCustomHookForNewsFeed(props);

  //For rendering the headlines.
  let renderItem = useCallback(
    (newsItemProps) => (
      <NewsItem {...newsItemProps} deleteItem={deleteItem} pinItem={pinItem} />
    ),
    []
  );
  //for optimising flatlist performance
  const newsItemLayout = useCallback(
    (_, index) => ({
      length: scale(135),
      offset: scale(135) * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headLineText}>{"Headlines"}</Text>
      </View>
      <View style={styles.innerElementsContainer}>
        {/* This is for displaying the pinned element and sticking it to the top, without having to reload the list*/}
        {pinnedElement !== null ? (
          <NewsItem
            item={pinnedElement}
            unPinItem={unPinItem}
            deleteItem={deleteItem}
            isPinned={true}
          />
        ) : null}

        {/* removeClippedSubviews, maxToRenderPerBatch, windowSize, getItemLayout are given to optimise flatlist performance*/}
        <FlatList
          data={feed}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id}
          ListEmptyComponent={<EmptyList error={error} />}
          style={styles.newLisContainer}
          contentContainerStyle={feed.length === 0 ? globalStyles.flex1 : {}}
          extraData={feed}
          initialNumToRender={7}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={15}
          getItemLayout={newsItemLayout}
          refreshing={refreshing}
          onRefresh={showLoadMore?loadMore:null}
        />
        {/* Pulling the list up refreshes the list and populates the next 5 elements */}
      </View>
    </View>
  );
}
