const groups: number[] = [];

// TODO: add more special char
const specialCharOpt: { [key: string]: number } = { "¡": 0, "™": 1, "£": 2 };

function sortGroupTab() {
  // re-adjust tab group oder by resetting group
  groups.length = 0;

  chrome.tabs.query({}, (tabs) => {
    const tempGroups: Set<number> = new Set();
    for (const tab of tabs) {
      if (tab.groupId !== -1) {
        tempGroups.add(tab.groupId);
      }
    }

    groups.push(...tempGroups);
  });
}

chrome.runtime.onStartup.addListener(() => {
  sortGroupTab();
});

chrome.tabs.onCreated.addListener(() => {
  sortGroupTab();
});

chrome.tabs.onUpdated.addListener(() => {
  sortGroupTab();
});

chrome.tabGroups.onUpdated.addListener(() => {
  sortGroupTab();
});

chrome.windows.onFocusChanged.addListener(() => {
  sortGroupTab();
});

chrome.runtime.onMessage.addListener((req, _, sendResp) => {
  chrome.tabGroups.get(groups[specialCharOpt[req?.dataKey]], (gt) => {
    chrome.tabGroups.update(gt.id, { collapsed: !gt.collapsed });
    sendResp("gt updated!");
  });

  return true;
});

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "re-sort-group-tab":
      sortGroupTab();
      break;
    case "toggle-tab-group":
      await chrome.action.openPopup();

      chrome.runtime.sendMessage(
        { action: "listen_group" },
        (response: { groupIdx: string }) => {
          chrome.tabGroups.get(
            groups[specialCharOpt[response?.groupIdx]],
            (gt) => {
              chrome.tabGroups.update(gt.id, { collapsed: !gt.collapsed });
            },
          );
        },
      );
      break;
  }
});
