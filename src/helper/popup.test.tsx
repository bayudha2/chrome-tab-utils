import { useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";

import {
  closePopup,
  getNoteData,
  getTabGroupsFormatted,
  storeNoteData,
} from "./popup";

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
  color: "red",
  title: "title-satu",
  url: "http://localhost",
};

describe("unit testing for popup helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call chrome getViews", () => {
    jest
      .spyOn(chrome.extension, "getViews")
      .mockImplementation((): Window[] => {
        return [];
      });

    closePopup();
    expect(chrome.extension.getViews).toHaveBeenCalled();
  });

  test("should get correct tab group", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(chrome.tabGroups, "query").mockImplementation((_, callback) => {
      return new Promise((resolve) => {
        callback([mockTab]);
        resolve([mockTab]);
      });
    });

    const TestComp = () => {
      const [tabGroups, setTabgroups] = useState<JSX.Element[]>([]);

      useEffect(() => {
        getTabGroupsFormatted(setTabgroups);
      }, []);

      return <div>{tabGroups}</div>;
    };

    render(<TestComp />);

    const item = screen.getByText("title-satu");
    expect(item).toBeInTheDocument();
    expect(chrome.tabGroups.query).toHaveBeenCalled();
  });

  test("should store note data correctly", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(chrome.tabs, "query").mockImplementation((_, callback) => {
      return new Promise((resolve) => {
        callback([mockTab]);
        resolve([mockTab]);
      });
    });

    jest.spyOn(chrome.storage.local, "set").mockImplementation(() => {});
    storeNoteData("data");

    expect(chrome.storage.local.set).toHaveBeenCalled();
  });

  test("should not store note data", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(chrome.tabs, "query").mockImplementation((_, callback) => {
      return new Promise((resolve) => {
        callback([mockTab]);
        resolve([mockTab]);
      });
    });

    jest.spyOn(chrome.storage.local, "set").mockImplementation(() => {});
    jest.spyOn(chrome.storage.local, "remove").mockImplementation(() => {});
    storeNoteData("");

    expect(chrome.storage.local.remove).toHaveBeenCalled();
  });

  test("should not get note data", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(chrome.tabs, "query").mockImplementation((_, callback) => {
      return new Promise((resolve) => {
        callback([mockTab]);
        resolve([mockTab]);
      });
    });

    jest.spyOn(chrome.storage.local, "get").mockImplementation(() => {
      return new Promise((resolve) => resolve(undefined));
    });

    getNoteData({} as React.MutableRefObject<null>);
  });

  test("should not get note data", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(chrome.tabs, "query").mockImplementation((_, callback) => {
      return new Promise((resolve) => {
        callback([mockTab]);
        resolve([mockTab]);
      });
    });

    jest.spyOn(chrome.storage.local, "get").mockImplementation(() => {
      return new Promise((resolve) => resolve({}));
    });

    getNoteData({} as React.MutableRefObject<null>);
  });

  test("should get note data correctly", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    jest.spyOn(chrome.tabs, "query").mockImplementation((_, callback) => {
      return new Promise((resolve) => {
        callback([mockTab]);
        resolve([mockTab]);
      });
    });

    jest.spyOn(chrome.storage.local, "get").mockImplementation(() => {
      return new Promise((resolve) =>
        resolve({ "http://localhost": JSON.stringify("test") }),
      );
    });

    const mockRef: React.MutableRefObject<null> = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      current: {
        value: null,
      },
    };

    getNoteData(mockRef);

    expect(chrome.storage.local.get).toHaveBeenCalled();
  });
});
