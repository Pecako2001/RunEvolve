import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LastRunCard from "../cards/LastRunCard";

describe("LastRunCard", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            name: "Test Run",
            created_at: new Date().toISOString(),
            distance: 5,
            time: 1500,
            average_speed: 12,
            heart_rate: 140,
          }),
      }),
    );
  });

  test("renders fetched data", async () => {
    render(<LastRunCard />);
    await waitFor(() => {
      expect(screen.getByText("Test Run")).toBeInTheDocument();
      expect(screen.getByText(/km\/h/)).toBeInTheDocument();
    });
  });
});
