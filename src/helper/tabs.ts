export const getCurrentTab = (cb: (tab: chrome.tabs.Tab) => unknown) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    cb(tabs[0]);
  });
};
