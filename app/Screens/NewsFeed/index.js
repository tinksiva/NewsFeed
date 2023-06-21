import { Text, View, FlatList } from "react-native";
import { useCallback } from "react";
//Custom Hooks
import { useCustomHookForNewsFeed } from "./hooks";

//Component Imports
import NewsItem from "../../components/NewsItem";
import LoadMoreButton from "../../components/Button";
import EmptyList from "../../components/EmptyList";

//scale function is used to make the ui responsive
import { styles } from "./styles";
import { scale } from "../../utils/scale";

export default function NewsFeed(props) {
  const {
    feed,
    pinnedElement,
    showLoadMore,
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
        {pinnedElement !== null ? (
          <NewsItem
            item={pinnedElement}
            unPinItem={unPinItem}
            deleteItem={deleteItem}
            isPinned={true}
          />
        ) : null}
        <FlatList
          data={feed}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id}
          ListEmptyComponent={<EmptyList />}
          style={styles.newLisContainer}
          extraData={feed}
          initialNumToRender={7}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={15}
          getItemLayout={newsItemLayout}
        />
        {feed.length > 0 && showLoadMore && (
          <LoadMoreButton loadMore={loadMore} />
        )}
      </View>
    </View>
  );
}
