import { SafeAreaView } from "react-native";
import { useCallback, useRef, useState } from "react";
import NewsFeed from "../NewsFeed/index";
import { fetchFromApi, storeInAsync } from "../../utils/utils";
import { globalStyles } from "../../utils/globalStyles";

export default function NewsWrapper() {
  //loading is an indicator to display the indicator while we fetch the data
  const page = useRef(1);
  const refetch = useCallback(async () => {
    let data = await fetchFromApi(page.current);
    let response = false;
    if (!data) {
      response = false;
    } else {
      response = await storeInAsync(data);
    }
    page.current = page.current + 1;
    return response;
  }, []);
  return (
    <SafeAreaView style={globalStyles.flex1}>
      <NewsFeed refetch={refetch} />
    </SafeAreaView>
  );
}
