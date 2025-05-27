import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AppNavbar } from "../layout/Navbar";

// Mock matchMedia used by useMediaQuery
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("Navbar", () => {
  test("renders user sidebar card", () => {
    render(<AppNavbar />);
    expect(screen.getByText("Kelvin Kiprop")).toBeInTheDocument();
    expect(screen.getByText("kelvin.kiprop96@gmail.com")).toBeInTheDocument();
  });
});
