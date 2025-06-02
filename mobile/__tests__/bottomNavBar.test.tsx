import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavBar from "../components/BottomNavBar";
import { ThemeProvider } from "../ThemeContext";
import { Provider as PaperProvider } from "react-native-paper";

test("bottom nav shows navigation buttons", () => {
  const { getByText } = render(
    <PaperProvider>
      <ThemeProvider>
        <NavigationContainer>
          <BottomNavBar />
        </NavigationContainer>
      </ThemeProvider>
    </PaperProvider>,
  );
  expect(getByText("Home")).toBeTruthy();
  expect(getByText("Statistics")).toBeTruthy();
  expect(getByText("Settings")).toBeTruthy();
});
