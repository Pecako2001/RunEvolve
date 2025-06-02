import React from "react";
import { render } from "@testing-library/react-native";
import RegisterScreen from "../screens/RegisterScreen";
import { ThemeProvider } from "../ThemeContext";
import { Provider as PaperProvider } from "react-native-paper";

it("shows sign up form", () => {
  const navigation = { goBack: jest.fn() } as any;
  const { getByPlaceholderText, getByText } = render(
    <PaperProvider>
      <ThemeProvider>
        <RegisterScreen navigation={navigation} />
      </ThemeProvider>
    </PaperProvider>
  );
  expect(getByPlaceholderText("Your Name")).toBeTruthy();
  expect(getByText("I accept the Terms & Conditions.")).toBeTruthy();
  expect(getByText("Create Account")).toBeTruthy();
});
