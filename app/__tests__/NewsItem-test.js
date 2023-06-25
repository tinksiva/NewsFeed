jest.useFakeTimers();
import "react-native";
import React from "react";
import NewsItem from "../components/NewsItem";

import renderer from "react-test-renderer";
const props = {
  item: {
    id: "c0a8fba6-3206-4129-9fd5-f15fcbe80081",
    title:
      "The Apple Device You Shouldn\u2019t Buy Right Now\u2014and the Ones You Should",
    description: "A guide to which Apple products are in season.",
    image: "https://images.wsj.net/im-800661/social",
  },
  deleteItem: () => {},
  pinItem: () => {},
  unPinItem: () => {},
  isPinned: false,
};
it("renders correctly", () => {
  const tree = renderer.create(<NewsItem {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
  props.isPinned=true;
  const tree2 = renderer.create(<NewsItem {...props} />).toJSON();
  expect(tree2).toMatchSnapshot();
});
