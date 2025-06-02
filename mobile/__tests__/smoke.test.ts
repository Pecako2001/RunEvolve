import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

test('renders without crashing', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toBeTruthy();
});
