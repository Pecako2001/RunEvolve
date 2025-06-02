import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import StatisticsScreen from "../screens/StatisticsScreen";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "../ThemeContext";

it("renders statistics screen", async () => {
  jest
    .spyOn(global, "fetch" as any)
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as any)
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as any);

  const { getByText } = render(
    <PaperProvider>
      <ThemeProvider>
        <StatisticsScreen />
      </ThemeProvider>
    </PaperProvider>,
  );
  await waitFor(() => getByText("Run Statistics"));

  expect(getByText("Run Statistics")).toBeTruthy();

  (global.fetch as jest.Mock).mockRestore();
});
