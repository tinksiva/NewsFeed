jest.useFakeTimers();
import "react-native";
import React from "react";
import NewsWrapper from "../Screens/NewsWrapper";
import { create, act } from "react-test-renderer";
jest.mock("@react-native-community/netinfo", () => ({
  fetch: () => Promise.resolve(jest.fn()),
  addEventListener: () => {
    return () => {};
  },
}));
jest.mock("./../utils/utils", () => {
  return {
    fetchFromApi: jest.fn().mockImplementation((page = 1) => {
      return Promise.resolve(Object);
    }),
    storeInAsync: jest.fn().mockImplementation((Object) => {
      return Promise.resolve(true);
    }),
  };
});

it("renders correctly", () => {
  let tree;
  act(() => {
    tree = create(<NewsWrapper />);
  });
  tree = tree.toJSON();
  expect(tree).toMatchSnapshot();
});
