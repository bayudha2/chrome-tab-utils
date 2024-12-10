import { getCurrentTab } from "./tabs";

const mockTab = {
  id: 1,
  active: true,
  index: 0,
  pinned: false,
  highlighted: false,
  windowId: 0,
  incognito: false,
  selected: false,
  discarded: false,
  autoDiscardable: false,
  groupId: 0,
};

describe("unit testing for helper tabs", () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  jest.spyOn(chrome.tabs, "query").mockImplementation((_, callback) => {
    return new Promise((resolve) => {
      callback([mockTab]);
      resolve([mockTab]);
    });
  });

  test("test getCurrentTab", () => {
    const mockCB = jest.fn().mockImplementation(() => {});
    getCurrentTab(mockCB);

    expect(mockCB).toHaveBeenCalled();
  });
});
