import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeartRateZonesCard from "../cards/HeartRateZonesCard";

const mockZones = {
  heart_rate: {
    zones: [
      { min: 0, max: 100 },
      { min: 100, max: 120 },
      { min: 120, max: 140 },
      { min: 140, max: 160 },
      { min: 160, max: -1 },
    ],
  },
};

describe("HeartRateZonesCard", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockZones),
      }),
    );
  });

  test("renders zones after fetch", async () => {
    render(<HeartRateZonesCard />);
    expect(screen.getByTestId("hrzones-loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Zone 1")).toBeInTheDocument();
      expect(screen.getByText("0 - 100 bpm")).toBeInTheDocument();
    });
  });

  test("shows message on fetch failure", async () => {
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.reject(new Error("fail")));
    render(<HeartRateZonesCard />);

    await waitFor(() => {
      expect(screen.getByText("No zones available")).toBeInTheDocument();
    });
  });
});
