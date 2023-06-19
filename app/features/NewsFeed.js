import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
} from "react-native";
import { useCallback, useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//scale function is used to make the ui responsive
import { scale, scaleFont } from "../utils/scale";

//Component Imports
import NewsItem from "../components/NewsItem";
import LoadMoreButton from "../components/Button";
import { colors } from "../themes/Colors";
const getData = async (start, end) => {
  let data;
  try {
    data = JSON.parse(await AsyncStorage.getItem("news"));
    return data.news.slice(start, end);
  } catch (error) {
    console.log(error);
    return [];
  }
};
export default function NewsFeed(props) {
  const [feed, setFeed] = useState([]);
  const page = useRef(0);
  const [pinnedElement, setPinnedElement] = useState(null);
  const pinnedElementRef = useRef(null);
  const timerId = useRef(null);
  const { refetch } = props;

  //For Fetching Data from local storage in batches of 5 except the first batch of 10
  const fetchData = useCallback((offset) => {
    if (page.current >= 100) {
      pageZeroRefetch();
      return;
    }
    getData(page.current, page.current + offset).then((resp) => {
      setFeed((previousFeed) => [...resp, ...previousFeed]);
    });
    page.current = page.current + offset;
  }, []);

  //For the timer for fetching data batches of 5 every 10 seconds
  const setTimer = useCallback(() => {
    timerId.current = setInterval(() => {
      fetchData(5);
    }, 10000);
  }, []);

  //For refreshing the content in the local storage when we have displayed all 100 news or shown zero news
  const pageZeroRefetch = useCallback((offset = 5) => {
    clearInterval(timerId.current);
    page.current = 0;
    async function fetchDataAsync() {
      await refetch();
    }
    fetchDataAsync().then(() => {
      fetchData(offset);
      setTimer();
    });
  }, []);

  //For setting up the timer for the inital render
  useEffect(() => {
    pageZeroRefetch(10);
    return () => {
      clearInterval(timerId.current);
    };
  }, []);

  //For the user to load More news manually
  const loadMore = useCallback(() => {
    clearInterval(timerId.current);
    fetchData(5);
    setTimer();
  }, []);

  //For deleteing an item
  const deleteItem = useCallback((id) => {
    if (
      pinnedElementRef.current !== null &&
      pinnedElementRef.current.id === id
    ) {
      console.log("in here");
      setPinnedElement(null);
      pinnedElementRef.current = null;
      return;
    } else {
      setFeed((curFeed) => {
        let newFeed = curFeed.filter((ele) => id !== ele.id);
        return newFeed;
      });
    }
  }, []);

  //For pinning an item
  const pinItem = useCallback((id) => {
    let pinned = pinnedElementRef?.current;
    setFeed((curFeed) => {
      rest = [];
      curFeed.forEach((ele) => {
        if (id !== ele.id) {
          rest.push(ele);
        } else {
          pinnedElementRef.current = ele;
          setPinnedElement(ele);
        }
      });
      return pinned ? [pinned, ...rest] : rest;
    });
  }, []);

  //For unpinning the pinned Item
  const unPinItem = useCallback((id) => {
    setPinnedElement(null);
    setFeed((curFeed) => {
      let newFeed = [pinnedElementRef.current, ...curFeed];
      pinnedElementRef.current = null;
      return newFeed;
    });
  }, []);

  //For rendering the headlines
  let renderItem = useCallback(
    (newsItemProps) => (
      <NewsItem {...newsItemProps} deleteItem={deleteItem} pinItem={pinItem} />
    ),
    []
  );

  //For displaying when the news feed is being fetched from storage
  let ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyComponentStyles}>
        <Text style={styles.emptyText}>{"Please Wait while we fetch the latest news for you"}</Text>
      </View>
    ),
    []
  );

  //for optimising flatlist performance
  const newsItemLayout = useCallback((_, index) => ({
    length: scale(135), 
    offset: scale(135) * (index),  
    index,
  }), [])

  console.log("FEED LENGTH", feed.length);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headLineText}>Today's Headlines</Text>
      </View>
      <View style={styles.innerElementsContainer}>
        {pinnedElement !== null ? (
          <NewsItem
            item={pinnedElement}
            index={0}
            unPinItem={unPinItem}
            deleteItem={deleteItem}
            isPinned={true}
          />
        ) : null}
        <FlatList
          data={feed}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id}
          ListEmptyComponent={ListEmptyComponent()}
          style={styles.newLisContainer}
          extraData={feed}
          initialNumToRender={7}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={15}
          getItemLayout={newsItemLayout}
        />
        <LoadMoreButton loadMore={loadMore} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: Platform.OS==="ios" ? "Times New Roman" : "serif",
    fontSize: scaleFont(18),
    marginTop: scale(28),
  },
  headerContainer: {
    height: "8%",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.black,
  },
  emptyComponentStyles :{justifyContent:"center", alignItems:"center", alignSelf:"center"},
  emptyText: {textAlign:"center"},
});
