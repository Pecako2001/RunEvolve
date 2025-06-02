import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavBar from "../components/BottomNavBar";

test("bottom nav shows navigation buttons", () => {
  const { getByText } = render(
    <NavigationContainer>
      <BottomNavBar />
    </NavigationContainer>
  );
  expect(getByText("Home")).toBeTruthy();
  expect(getByText("Stats")).toBeTruthy();
});
