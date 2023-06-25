jest.useFakeTimers()
import 'react-native';
import React from 'react';
import DeleteAndPin from "../components/DeleteAndPin";

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <DeleteAndPin />
    ).toJSON();
  expect(tree).toMatchSnapshot();
});