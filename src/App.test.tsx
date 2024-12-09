import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./helper/popup", () => ({
  getNoteData: () => jest.fn(),
  getTabGroupsFormatted: jest.fn(),
  popupKeydownListener: jest.fn(),
  storeNoteData: jest.fn(),
}));

describe("unit testing for app", () => {
  test("should render app", () => {
    render(<App />);
    const textArea = screen.getByTestId("text-area-note");
    expect(textArea).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(textArea, { key: "Escape", code: "Escape" });
    });
  });

  test("should change tab", () => {
    render(<App />);
    const btnFuzzy = screen.getByTestId("btn-start-fuzzy-find");
    expect(btnFuzzy).toBeInTheDocument();

    act(() => {
      fireEvent.click(btnFuzzy);
    });
  });
});
