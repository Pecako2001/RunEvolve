import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../screens/LoginScreen";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

test("calls success callback on login", async () => {
  const fetchMock = jest.spyOn(global, "fetch" as any).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ access_token: "token" }),
  } as any);
  const onSuccess = jest.fn();
  const navigation = { replace: jest.fn(), navigate: jest.fn() } as any;
  const { getByText, getByPlaceholderText } = render(
    <LoginScreen navigation={navigation} onSuccess={onSuccess} />
  );
  fireEvent.changeText(getByPlaceholderText("Email"), "user@example.com");
  fireEvent.changeText(getByPlaceholderText("Password"), "pass");
  fireEvent.press(getByText("Sign in"));
  await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  fetchMock.mockRestore();
});

test("calls error callback on failure", async () => {
  const fetchMock = jest.spyOn(global, "fetch" as any).mockResolvedValue({
    ok: false,
  } as any);
  const onError = jest.fn();
  const navigation = { replace: jest.fn(), navigate: jest.fn() } as any;
  const { getByText, getByPlaceholderText } = render(
    <LoginScreen navigation={navigation} onError={onError} />
  );
  fireEvent.changeText(getByPlaceholderText("Email"), "bad@example.com");
  fireEvent.changeText(getByPlaceholderText("Password"), "pass");
  fireEvent.press(getByText("Sign in"));
  await waitFor(() => expect(onError).toHaveBeenCalled());
  fetchMock.mockRestore();
});
