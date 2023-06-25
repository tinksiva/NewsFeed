jest.useFakeTimers()
import 'react-native';
import React from 'react';
import EmptyList from "../components/EmptyList";

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <EmptyList />
    ).toJSON();
  expect(tree).toMatchSnapshot();
});