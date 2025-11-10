const groups: number[] = []; // TODO: move var to storage

const specialCharOpt: { [key: string]: number } = {
  "¡": 0,
  "™": 1,
  "£": 2,
  "¢": 3,
  "∞": 4,
  "§": 5,
  "¶": 6,
  "•": 7,
  ª: 8,
};

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

function collapseTabGroup(char: string) {
  const selectedGroup = groups[specialCharOpt[char]];
  if (!selectedGroup) return;

  chrome.tabGroups.get(selectedGroup, (gt) => {
    chrome.tabGroups.update(gt.id, { collapsed: !gt.collapsed });
  });
}

function createNewTabToTheRight() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;

    const currentWindow = tabs[0];
    const idx = currentWindow.index;
    chrome.tabs.create(
      {
        index: idx === 0 ? 1 : idx + 1,
      },
      (tab) => {
        if (currentWindow.groupId === -1) return;
        chrome.tabs.group({ tabIds: tab.id, groupId: currentWindow.groupId });
      },
    );
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

chrome.runtime.onMessage.addListener(
  (req: { dataKey?: string; newTab?: boolean }) => {
    if (req?.dataKey) {
      collapseTabGroup(req.dataKey);
    }

    if (req?.newTab) {
      createNewTabToTheRight();
    }

    return true;
  },
);

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "re-sort-group-tab":
      sortGroupTab();
      break;

    case "toggle-tab-group":
      await chrome.action.openPopup();
      sortGroupTab();

      chrome.runtime.sendMessage(
        { action: "listen_group" },
        (response: { dataKey?: string; newTab?: boolean }) => {
          if (response?.dataKey) {
            collapseTabGroup(response.dataKey);
          }

          if (response?.newTab) {
            createNewTabToTheRight();
          }
        },
      );
      break;
  }
});
