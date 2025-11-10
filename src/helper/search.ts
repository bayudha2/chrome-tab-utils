import { getAllTabs, getCurrentTab } from "./tabs";

export const startFuzzyFind = (text: string = ""): Promise<string[]> => {
  return new Promise((resolve) => {
    getCurrentTab((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            action: "start-fuzzy-find",
            text,
          },
          (resp) => {
            resolve(JSON.parse(resp?.data));
          },
        );
      }
    });
  });
};

// INFO: for highlighting founded words
export const fuzzyFindWord = (text: string = "") => {
  if (!text || text === "") {
    return;
  }

  getCurrentTab((tab) => {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: "search-text",
        text: text,
      });
    }
  });
};

export const findTabs = async (text: string = "") => {
  const tabs = await getAllTabs();

  if (tabs.length < 1) {
    return;
  }

  const sortedUrls = tabs.sort((ta, tb) => {
    const taLowerCase = ta.url?.toLowerCase();
    const tbLowerCase = tb.url?.toLowerCase();

    if (!taLowerCase || !tbLowerCase) {
      return 0;
    }

    if (taLowerCase < tbLowerCase) {
      return -1;
    }

    if (taLowerCase > tbLowerCase) {
      return 1;
    }

    return 0;
  });

  const searchResult = sortedUrls.filter((u) =>
    u.url?.toLowerCase().includes(text.toLowerCase()),
  );

  return searchResult;
};
