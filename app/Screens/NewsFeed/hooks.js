import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useState, useRef } from "react";
import { getDataFromAsync } from "../../utils/utils";

//Separating Concerns using React Custom Hooks. Instead of crowding the presentational component with buisness logic, seperated them into a custom hook to declutter it
export function useCustomHookForNewsFeed(props) {
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState(false);
  const page = useRef(0);
  const [pinnedElement, setPinnedElement] = useState(null);
  const [showLoadMore, setLoadMore] = useState(true);
  const pinnedElementRef = useRef(null);
  const netinfoSubscription = useRef(null);
  const timerId = useRef(null);

  const { refetch } = props;

  //For Fetching Data from local storage in batches of 5 except the first batch of 10
  const fetchData = useCallback((offset) => {
    if (page.current >= 100) {
      //If we have displayed all 100 items we reset the page to zero and proceed to fetch the next batch of headlines from the api
      pageZeroRefetch();
      return;
    }
    getDataFromAsync(page.current, page.current + offset).then((resp) => {
      if (resp === null || resp.length === 0) {
        //Stopping the timer if we run out of news
        clearInterval(timerId.current);
        return;
      }
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

  const clearTimer = useCallback(() => {
    clearInterval(timerId.current);
  }, []);

  //For refreshing the content in the local storage when we have displayed all 100 news or shown zero news
  const pageZeroRefetch = useCallback((offset = 5) => {
    clearTimer();
    page.current = 0;
    NetInfo.fetch().then((state) => {
      //We check if the application is connected to the internet before we fetch the next batch of news. If proceed only if it is connected
      if (state.isConnected) {
        refetch().then((resp) => {
          if (resp) {
            //If we still get response from api indicating there is more news to show
            fetchData(offset);
            setTimer();
            setError(false);
          } else {
            //If we dont get any response from the api , it inidicates we have displayed all the news. we clear the timer and hide the load more button
            Toast.show("All the latest technology news have been loaded", {
              duration: Toast.durations.LONG,
            });
            setError(true);
            setLoadMore(false);
            clearTimer();
          }
        });
      } else {
        //If the application is not connected to the internet we add a listener and wait till the internet is back. once its back we stop the listener and start the timer
        Toast.show(
          "Sorry, Looks like your internet is gone. You would still be able to browse through the available news",
          {
            duration: Toast.durations.LONG,
          }
        );
        setLoadMore(false);
        netinfoSubscription.current = NetInfo.addEventListener((state) => {
          if (state.isConnected && !showLoadMore) {
            Toast.show("Connected to the internet again!", {
              duration: Toast.durations.LONG,
            });
            netinfoSubscription.current();
            pageZeroRefetch();
            setLoadMore(true);
          }
        });
      }
    });
  }, []);

  //For setting up the timer for the inital render. For fetching the initial news from the api and fror fetch the first 10 headlines
  useEffect(() => {
    pageZeroRefetch(10);
    return () => {
      clearTimer();
      netinfoSubscription?.current && netinfoSubscription.current();
    };
  }, []);

  //For the user to load More news manually skipping the timer. we stop the timer. fetch and display the news and reset the timer again
  const loadMore = useCallback(() => {
    clearTimer();
    fetchData(5);
    setTimer();
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
    pinItem: pinItem,
    unPinItem: unPinItem,
    deleteItem: deleteItem,
    loadMore: loadMore,
  };
}
