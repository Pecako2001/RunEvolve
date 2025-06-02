import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SalesCard from "../cards/SalesCard";

describe("SalesCard", () => {
  test("renders title, value, subtitle and badge", () => {
    render(
      <SalesCard
        title="Sales Today"
        value={13456}
        percentage={5}
        subtitle="Compared to last month"
        badgeLabel="Today"
      />,
    );

    expect(screen.getByText("Sales Today")).toBeInTheDocument();
    expect(screen.getByText("13456")).toBeInTheDocument();
    expect(screen.getByText("Compared to last month")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    const percentage = screen.getByTestId("percentage");
    expect(percentage).toHaveTextContent("5%");
    expect(percentage).toHaveClass("text-green-600");
  });

  test("shows red percentage for negative values", () => {
    render(<SalesCard title="Sales" value={100} percentage={-3} />);

    const percentage = screen.getByTestId("percentage");
    expect(percentage).toHaveTextContent("3%");
    expect(percentage).toHaveClass("text-red-600");
  });
});
