import React from "react";
import { render, screen } from "@testing-library/react";
import InfoPage from "../page";

describe("InfoPage", () => {
  test("renders main title", () => {
    render(<InfoPage />);
    expect(
      screen.getByRole("heading", { name: /Project Information/i, level: 1 }),
    ).toBeInTheDocument();
  });

  test("shows github link", () => {
    render(<InfoPage />);
    expect(
      screen.getByRole("link", { name: /RunEvolve GitHub/i }),
    ).toBeInTheDocument();
  });
});
