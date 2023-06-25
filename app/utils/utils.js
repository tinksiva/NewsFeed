import AsyncStorage from "@react-native-async-storage/async-storage";
import news from "../../news.json";
import { NEWS_API_KEY, NEWS_API } from "@env";

export const storeDataLocally = async (value) => {
  //Stores the data fetched from news api into the local storage using the key "news"
  try {
    await AsyncStorage.setItem("news", JSON.stringify(value));
  } catch (error) {
    console.log("syncstrot", error);
  }
};
export const fetchFromApi = async (page) => {
  // Fetches the next 100 news from the news api depending on the page number
  // On every fetch we fetch 100 news headlines  under the technology category using our api key
  // The API supports only 600 requests for a free account

  var url =
    NEWS_API +
    new URLSearchParams({
      language: "en",
      category: "technology",
      apiKey: NEWS_API_KEY,
      page_size: 100,
      limit: 100,
      page_number: page,
    });

  // var req = new Request(url);
  // try {
  //   let response = await fetch(req);
  //   let data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.log("ERROR", error);
  //   return null;
  // }

  // For Testing Purposes
  // await storeDataLocally(news);
  // setLoading(false);
  return news;
};
export const storeInAsync = async (data) => {
  // Fetches the next 100 news from the news api depending on the page number
  // On every fetch we fetch 100 news headlines  under the technology category using our api key
  // The API supports only 600 requests for a free account

  try {
    await storeDataLocally(data);
    return true;
  } catch (error) {
    console.log("ERROR", error);
    return false;
  }

  // For Testing Purposes
  // await storeDataLocally(news);
  // setLoading(false);
  // return true;
};

export const getDataFromAsync = async (start, end) => {
  //We fetch the data that we have stored in the local storage and return it to the component for use
  let data;
  try {
    data = JSON.parse(await AsyncStorage.getItem("news"));
    return data.news.slice(start, end);
  } catch (error) {
    console.log(error);
    return [];
  }
};
