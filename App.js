import { GestureHandlerRootView } from "react-native-gesture-handler";
import NewsWrapper from "./app/Screens/NewsWrapper";
import { globalStyles } from "./app/utils/globalStyles";
import { RootSiblingParent } from 'react-native-root-siblings';


export default function App() {
  return (
    <GestureHandlerRootView style={globalStyles.flex1}>
      <RootSiblingParent>
        <NewsWrapper />
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}
