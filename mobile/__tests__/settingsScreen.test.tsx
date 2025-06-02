import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SettingsScreen from "../screens/SettingsScreen";
import { ThemeProvider } from "../ThemeContext";
import { Provider as PaperProvider } from "react-native-paper";
import { lightColors, darkColors } from "../theme";

it("shows default settings options", () => {
  const { getByText } = render(
    <PaperProvider>
      <ThemeProvider>
        <SettingsScreen />
      </ThemeProvider>
    </PaperProvider>,
  );
  expect(getByText("Dark Theme")).toBeTruthy();
  expect(getByText("Text Size")).toBeTruthy();
});

it("toggles dark mode colors", () => {
  const { getByA11yLabel, getByText } = render(
    <PaperProvider>
      <ThemeProvider>
        <SettingsScreen />
      </ThemeProvider>
    </PaperProvider>,
  );
  const title = getByText("Settings");
  expect((title.props.style as any).color).toBe(lightColors.foreground);
  fireEvent(getByA11yLabel("toggle dark theme"), "valueChange", true);
  expect((getByText("Settings").props.style as any).color).toBe(
    darkColors.foreground,
  );
});
