import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserSidebarCard from "../layout/UserSidebarCard";

describe("UserSidebarCard", () => {
  test("renders name, email and icon", () => {
    render(
      <UserSidebarCard
        name="Kelvin Kiprop"
        email="kelvin.kiprop96@gmail.com"
        avatarSrc="/avatar.png"
      />,
    );

    expect(screen.getByText("Kelvin Kiprop")).toBeInTheDocument();
    expect(screen.getByText("kelvin.kiprop96@gmail.com")).toBeInTheDocument();
    expect(screen.getByLabelText("menu")).toBeInTheDocument();
  });
});
