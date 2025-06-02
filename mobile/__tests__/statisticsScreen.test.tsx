import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import StatisticsScreen from "../screens/StatisticsScreen";

it("renders statistics screen", async () => {
  jest.spyOn(global, "fetch" as any).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([]),
  } as any).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([]),
  } as any);

  const { getByText } = render(<StatisticsScreen />);
  await waitFor(() => getByText("Run Statistics"));

  expect(getByText("Run Statistics")).toBeTruthy();

  (global.fetch as jest.Mock).mockRestore();
});
