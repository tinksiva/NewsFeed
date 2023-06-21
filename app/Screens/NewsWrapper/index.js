import { SafeAreaView } from "react-native";
import { useCallback, useRef, useState } from "react";
import NewsFeed from "../NewsFeed/index";
import { fetchAndStoreInAsync } from "../../utils/utils";
import { globalStyles } from "../../utils/globalStyles";

export default function NewsWrapper() {
  //loading is an indicator to display the indicator while we fetch the data
  const [loading, setLoading] = useState(false);
  const page = useRef(1);
  const refetch = useCallback(async () => {
    let response = await fetchAndStoreInAsync(setLoading, page.current);
    page.current = page.current + 1;
    return response;
  }, []);
  return (
    <SafeAreaView style={globalStyles.flex1}>
      {loading ? (
        <ActivityIndicator color={"red"} />
      ) : (
        <NewsFeed refetch={refetch} />
      )}
    </SafeAreaView>
  );
}
