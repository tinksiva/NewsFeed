import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useState, useRef } from "react";
import { getDataFromAsync } from "../../utils/utils";
import Toast from "react-native-root-toast";

//Separating Concerns using React Custom Hooks. Instead of crowding the presentational component with buisness logic, seperated them into a custom hook to declutter it
export function useCustomHookForNewsFeed(props) {
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState(false);
  const page = useRef(0);
  const [pinnedElement, setPinnedElement] = useState(null);
  const [showLoadMore, setLoadMore] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const pinnedElementRef = useRef(null);
  const netinfoSubscription = useRef(null);
  const timerId = useRef(null);
  const currentData = useRef(null);

  const { refetch } = props;

  //For Fetching Data from local storage in batches of 5 except the first batch of 10
  const fetchData = useCallback((offset) => {
    if (page.current >= 100) {
      //If we have displayed all 100 items we reset the page to zero and proceed to fetch the next batch of headlines from the api
      pageZeroRefetch();
      return;
    }
    //Slices the current slice of data from the original 100 fetched from local storage to refresh the app
    let currentSlice = currentData.current.slice(
      page.current,
      page.current + offset
    );
    if (currentSlice.length === 0) {
      //When the new batch of data contains less than 100 headlines and when we have exhausted all of them we clear the timer
      clearInterval(timerId.current);
      setLoadMore(false);
      return;
    }
    setFeed((previousFeed) => [...currentSlice, ...previousFeed]);

    //Addjusting the offset for the next fetch
    page.current = page.current + offset;
  }, []);

  //Fetch the news from local storage to the component data
  const getDataFromAsyncAndStoreItInLocal = useCallback(async () => {
    let resp = await getDataFromAsync(0, 100);

    if (resp === null || resp.length === 0) {
      //Stopping the timer if we run out of news
      clearInterval(timerId.current);
      return false;
    } else {
      //Storing the headlines fetched from local storage into the component for ease of access
      //This also minimises having to fetch from local storage repeatedly
      currentData.current = resp;
      return true;
    }
  }, []);

  //For the timer for fetching data in batches of 5 every 10 seconds
  const setTimer = useCallback(() => {
    timerId.current = setInterval(() => {
      fetchData(5);
    }, 10000);
  }, []);

  //For refreshing the content in the local storage when we have displayed all 100 news or shown zero news
  const pageZeroRefetch = useCallback((offset = 5) => {
    clearInterval(timerId.current);
    currentData.current = [];
    page.current = 0;
    NetInfo.fetch().then((state) => {
      //We check if the application is connected to the internet before we fetch the next batch of news. If proceed only if it is connected
      if (state.isConnected) {
        setIsConnected(true);
        refetch().then((resp) => {
          if (resp) {
            //If we still get response from api indicating there is more news to show and when we have successfully stored it the async storage
            getDataFromAsyncAndStoreItInLocal().then((aysncStorageResp) => {
              if (aysncStorageResp) {
                //Fetched the response from async storage to reference variable. We fetch the first 10 data and we start the timer again
                fetchData(offset);
                setTimer();
                setError(false);
                setLoadMore(true);
              } else {
                //If there is an error in fetching from the local storage we clear the timer and set the error
                clearInterval(timerId.current);
                setError(true);
                setLoadMore(false);
              }
            });
          } else {
            //If we dont get any response from the api , it inidicates we have displayed all the news. we clear the timer and hide the load more button
            currentData?.current?.length > 0 &&
              Toast.show("All the latest technology news have been loaded", {
                duration: Toast.durations.LONG,
              });
            setError(true);
            setLoadMore(false);
            clearInterval(timerId.current);
          }
        });
      } else {
        //If the application is not connected to the internet we add a listener and wait till the internet is back. once its back we start the timer again and unsubcribe the listener
        netinfoSubscription.current = NetInfo.addEventListener((state) => {
          if (state.isConnected) {
            Toast.show("Connected to the internet again!", {
              duration: Toast.durations.LONG,
            });
            setIsConnected(true);
            pageZeroRefetch();
            netinfoSubscription.current();
          } else if (!state.isConnected) {
            setError(true);
          }
        });
        Toast.show("Sorry, Looks like your internet is down.", {
          duration: Toast.durations.LONG,
        });
        setIsConnected(false);
        setError(true);
        setLoadMore(false);
        clearInterval(timerId.current);
      }
    });
  }, []);

  //For setting up the timer for the inital render. For fetching the initial news from the api and fror fetch the first 10 headlines
  useEffect(() => {
    pageZeroRefetch(10);
    return () => {
      clearInterval(timerId.current);
      netinfoSubscription?.current && netinfoSubscription.current();
    };
  }, []);

  //For the user to load More news manually skipping the timer. we stop the timer. fetch and display the news and reset the timer again
  const loadMore = useCallback(() => {
    setRefreshing(true);
    clearInterval(timerId.current);
    fetchData(5);
    setTimer();
    setRefreshing(false);
  }, []);

  //For deleteing an item. If the item to be deleted is the pinned item we delete it . If not we delete the item to be deleted from the feed
  const deleteItem = useCallback((id, isPinned) => {
    if (isPinned) {
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

  //For pinning an item. we fetch the item , store into a seperate state and keep the rest of the feed the same
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

  //For unpinning the pinned Item. we simply add back the pinned item to the feed
  const unPinItem = useCallback((id) => {
    setPinnedElement(null);
    setFeed((curFeed) => {
      let newFeed = [pinnedElementRef.current, ...curFeed];
      pinnedElementRef.current = null;
      return newFeed;
    });
  }, []);

  return {
    feed,
    pinnedElement,
    showLoadMore,
    error,
    refreshing,
    pinItem: pinItem,
    unPinItem: unPinItem,
    deleteItem: deleteItem,
    loadMore: loadMore,
  };
}
