News Feed App

This app has been built with Expo and Expo Go
To try this app you can download the apk

Functionalities of the App
- Fetches 100 tech headlines from an news api and stores it in local storage
- While we are fetching from the api we show the loader to the user.
- While we are fetching from the local storage we show the user a message on the screen
- Intially only 10 headlines that were fetched from the api is displayed
- For every 10 seconds fetches the next 5 headlines from the storage and displays it
- User can manually fetch the next 5 headlines instead of waiting for the timer by clicking the load more button
- Clicking the load more button resets the timer
- User can delete and item by swiping the news item and clicking the delete button. Deleting an item removed it from the feed
- User can pin an item by swiping the news item and clicking the pin button
- Pinning an item, sticks that item to the top of the list. The item stays there even when the list is updating or if the user is scrolling
- User can pin a news item even if there already is a pinned item. The newly pinned item would take the place of the old pinned item and the old pinned item would again be added to the scrollable list
- User can also delete a pinned item removing it from the feed
- Once all 100 news have been fetched , the next batch of 100 news is fetched from the api and stored in the local storage and the process repeats itself
- If there is no more news to fetch from the api, we stop the timer and hide the load more button. The user can go through the already available news
- If the user loses internet connection while the current data from local storage is still being populated into the app, the timer still keeps going and the list is updated. Once all the data from the current batch in local storage is shown user is displayed a toast message saying there "Internet is down" and the timer is stopped and the load more button is hidden. Once the internet connectivity is back, we fetch the next batch from api and trigger the timer again
- If the user kills and re-opens the app the current batch from the local storage is repopulated again
- If there is an error at any point and we dont have any more news left in the local storage to show we display a toast message to let the users know.
- The app automatically scales the sizes of its content to fit devices of different dimensions
- The app scrolls smoothly till it reaches its end

Technical Details
- Custom hooks are used for seperation of concerns.
- Scaling is used for responsiveness
- A react-native-net-info is added to monitor internet connectivity
- react-native-dotenv is added to configure the env file for api end points
- react-native-gesture-handler is added to enable swiping of news item
- react-native-root-toast is added to show toast messages
- Although packages like expo-localisation, i18ns, redux, react-query, MMKV could be used , those were not added as they did'nt justify the usage for the given challenge, in addition to keep the app size small
- For loading more data decided to go with a button instead of pulling up the screen to refresh cause it explicitly gives user that option
