import AsyncStorage from "@react-native-async-storage/async-storage";
import news from "../../news.json";
import { NEWS_API_KEY, NEWS_API } from '@env';

// import { MMKV } from 'react-native-mmkv'

// export const storage = new MMKV()
export const storeDataLocally = async (value) => {
  //Stores the data fetched from news api into the local storage using the key "news"
  try {
    await AsyncStorage.setItem("news", JSON.stringify(value));
  } catch (error) {
    console.log("syncstrot", error);
  }
};
export const fetchAndStoreInAsync = async (setLoading, page) => {
  // Fetches the next 100 news from the news api depending on the page number
  // On every fetch we fetch 100 news headlines  under the technology category using our api key
  // The API supports only 600 requests for a free account

  var url =
    NEWS_API +
    new URLSearchParams({
      language: "value",
      bar: 2,
      language: "en",
      category: "technology",
      apiKey: NEWS_API_KEY,
      page_size: 100,
      limit: 100,
      page_number: page,
    });
  // var url =
  //   "https://api.currentsapi.services/v1/search?language=en&category=technology&apiKey=IObvAhu35l2ju4qFNO3Bo7CBdu34VXGRphVGnAru71isn5X-&page_size=100&limit=100&page_number=" +
  //   page;

    var req = new Request(url);
    try {
      let response = await fetch(req);
      let data = await response.json();
      await storeDataLocally(data);
      setLoading(false);
      return true;
    } catch (error) {
      console.log("ERROR", error);
      setLoading(false);
      return false;
    }

  //For Testing Purposes
  // await storeDataLocally(news);
  // setLoading(false);
  // return true;
};

export const getDataFromAsync = async (start, end) => {
  let data;
  try {
    data = JSON.parse(await AsyncStorage.getItem("news"));
    return data.news.slice(start, end);
  } catch (error) {
    console.log(error);
    return [];
  }
};
