import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavBar from "../components/BottomNavBar";
import { ThemeProvider } from "../ThemeContext";

test("bottom nav shows navigation buttons", () => {
  const { getByText } = render(
    <ThemeProvider>
      <NavigationContainer>
        <BottomNavBar />
      </NavigationContainer>
    </ThemeProvider>,
  );
  expect(getByText("Home")).toBeTruthy();
  expect(getByText("Stats")).toBeTruthy();
  expect(getByText("Settings")).toBeTruthy();
});
