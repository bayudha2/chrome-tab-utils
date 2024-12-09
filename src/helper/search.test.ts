import { fuzzyFindWord, startFuzzyFind } from "./search";

jest.mock("./tabs", () => ({
  getCurrentTab: (cb: (tab: unknown) => unknown) => {
    cb({ id: 1 });
  },
}));

describe("unit testing for seach helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("test startFuzzyFind", async () => {
    jest
      .spyOn(chrome.tabs, "sendMessage")
      .mockImplementation((_, _a, callback) => {
        return new Promise((resolve) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          callback({ data: JSON.stringify(["something"]) });
          resolve("");
        });
      });

    const res = await startFuzzyFind("test");
    expect(res[0]).toEqual("something");
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
      1,
      {
        action: "start-fuzzy-find",
        text: "test",
      },
      expect.any(Function),
    );
  });

  test("test fuzzyFindWord", () => {
    jest.spyOn(chrome.tabs, "sendMessage").mockImplementation(() => {
      return new Promise((resolve) => {
        resolve("");
      });
    });

    fuzzyFindWord("test");
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
      action: "search-text",
      text: "test",
    });
  });

  test("test fuzzyFindWord no text", () => {
    jest.spyOn(chrome.tabs, "sendMessage").mockImplementation(() => {
      return new Promise((resolve) => {
        resolve("");
      });
    });

    fuzzyFindWord("");
  });
});
