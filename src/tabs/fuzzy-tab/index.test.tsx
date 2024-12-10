import { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FuzzyTab } from ".";

jest.mock("../../helper/search", () => ({
  fuzzyFindWord: jest.fn(),
  startFuzzyFind: jest
    .fn()
    .mockResolvedValue([
      "some",
      "thing",
      "else",
      "rather",
      "then",
      "nothing",
      "okey",
      "test1",
      "test2",
      "test3",
      "test4",
    ]),
}));

describe("unit testing for fuzzy-tab", () => {
  test("should render ", async () => {
    render(<FuzzyTab />);
    const input = screen.getByTestId("input-fuzzy-search");
    expect(input).toBeInTheDocument();

    act(() => {
      fireEvent.input(input, { target: { value: "som" } });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "Enter", Code: "Enter" });
    });

    await waitFor(() => {
      const btnThingItem = screen.getByTestId("btn-item-fuzzy-thing");
      expect(btnThingItem).toBeInTheDocument();

      act(() => {
        fireEvent.click(btnThingItem);
      });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "¡", Code: "Digit1" });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "™", Code: "Digit2" });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "£", Code: "Digit3" });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "¢", Code: "Digit4" });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "∞", Code: "Digit5" });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "§", Code: "Digit6" });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "¶", Code: "Digit7" });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "•", Code: "Digit8" });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "ª", Code: "Digit9" });
    });

    act(() => {
      fireEvent.keyDown(input, { key: "º", Code: "Digit0" });
    });
  });

  test("should render ", async () => {
    render(<FuzzyTab />);
    const input = screen.getByTestId("input-fuzzy-search");
    expect(input).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(input, { key: "Enter", Code: "Enter" });
    });
  });
});
