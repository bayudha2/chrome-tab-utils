import { getCurrentTab } from "./tabs";

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
