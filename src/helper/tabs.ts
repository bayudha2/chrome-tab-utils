export const getCurrentTab = (cb: (tab: chrome.tabs.Tab) => unknown) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    cb(tabs[0]);
  });
};

export const getAllTabs = async () => {
  const tabs = await chrome.tabs.query({});
  return tabs;
};

export const changeActiveTab = async (tabId: number, windowId: number) => {
  await chrome.tabs.update(tabId, { active: true });
  await chrome.windows.update(windowId, { focused: true });
};
