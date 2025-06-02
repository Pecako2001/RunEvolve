import React from "react";
import { render } from "@testing-library/react-native";
import SettingsScreen from "../screens/SettingsScreen";

it("shows default settings options", () => {
  const { getByText } = render(<SettingsScreen />);
  expect(getByText("Dark Theme")).toBeTruthy();
  expect(getByText("Large Text")).toBeTruthy();
});
