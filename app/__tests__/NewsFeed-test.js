jest.useFakeTimers();
import "react-native";
import React from "react";
import NewsFeed from "../Screens/NewsFeed/index";
import { create, act } from "react-test-renderer";
jest.mock("@react-native-community/netinfo", () => ({
  fetch: () => Promise.resolve(jest.fn()),
  addEventListener: () => {
    return () => {};
  },
}));
it("renders correctly", () => {
  let tree;

  act(() => {
    tree = create(
      <NewsFeed
        refetch={
          new Promise(
            () => {
              return true;
            },
            () => {
              return false;
            }
          )
        }
      />
    );
  });
  tree = tree.toJSON();
  expect(tree).toMatchSnapshot();
});
