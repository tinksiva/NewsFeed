import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useCallback, useRef, useState } from "react";
import NewsFeed from "./app/features/NewsFeed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import news from "./news.json";

const storeDataLocally = async (value) => {
  //Stores the data fetched from news api into the local storage using the key "news"
  try {
    await AsyncStorage.setItem("news", JSON.stringify(value));
  } catch (error) {
    console.log("syncstrot", error);
  }
};
const fetchAndStoreInAsync = async (setLoading, page) => {
  //Fetches the next 100 news from the news api depending on the page number
  //On every fetch we fetch 100 news headlines  under the technology category using our api key

  // var url =
  //   "https://api.currentsapi.services/v1/search?language=en&category=technology&apiKey=IObvAhu35l2ju4qFNO3Bo7CBdu34VXGRphVGnAru71isn5X-&page_size=100&limit=100&page_number="+page;

  // var req = new Request(url);
  // try{
  // let response = await fetch(req);
  // let data = await response.json();
  // await storeDataLocally(data);
  // setLoading(false);
  // }
  // catch (error) {
  //   console.log("ERROR", error)
  // }
  await storeDataLocally(news);
  setLoading(false);
};
export default function App() {
  const [loading, setLoading] = useState(false);
  const page = useRef(1);
  const refetch = useCallback(async () => {
    
    await fetchAndStoreInAsync(setLoading, page.current);
    page.current=page.current+1;

  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator color={"red"} />
        ) : (
          <NewsFeed refetch={refetch} />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
});
