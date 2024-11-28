import { transformColorOpt } from "./color";

const specialCharOpt = ["¡", "™", "£", "¢", "∞", "§", "¶", "•", "ª"];

export const closePopup = () => {
  chrome.extension.getViews({ type: "popup" }).forEach((v) => v.close());
};

export const getTabGroupsFormatted = (
  setTabGroups: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
) => {
  chrome.tabGroups.query({}, (tgs) => {
    if (tgs.length > 0) {
      const format = tgs.map((tg, i) => (
        <div key={`key-${tg.title}`}>
          <p
            style={{
              backgroundColor: transformColorOpt[tg.color].bg,
              color: transformColorOpt[tg.color].font,
            }}
            className="tg-chip"
          >
            {tg.title}
          </p>

          <p
            className="tg-sub-chip"
            style={{
              borderTop: `1px solid ${transformColorOpt[tg.color].line}`,
            }}
          >
            [Alt + {i + 1}]
          </p>
        </div>
      ));

      setTabGroups(format);
    }
  });
};

export const popupKeydownListener = (
  inputTextAreaRef: React.MutableRefObject<null>,
) => {
  chrome.runtime.onMessage.addListener((req, _, sendResponse) => {
    if (req.action === "listen_group") {
      document.addEventListener(
        "keydown",
        (e) => {
          if (specialCharOpt.includes(e.key)) {
            sendResponse({ dataKey: e.key });
          }

          if (e.key === "†") {
            sendResponse({ newTab: true });
          }

          if (e.key === "n") {
            (inputTextAreaRef.current! as HTMLInputElement).focus();
            e.preventDefault();
            sendResponse();
          }

          if (e.key !== "n") {
            sendResponse();
            closePopup();
          }
        },
        { once: true },
      );
    }

    return true;
  });
};

export const storeNoteData = async (data: unknown) => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const currentTab = tabs[0];
    const baseUrl = new URL(currentTab.url || "").origin;

    if (data || (typeof data === "string" && data !== "")) {
      await chrome.storage.local.set({ [baseUrl]: JSON.stringify(data) });
      closePopup();
    }

    if (!data) {
      await chrome.storage.local.remove([baseUrl]);
      closePopup();
    }
  });
};

export const getNoteData = (inputRef: React.MutableRefObject<null>) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const baseUrl = new URL(currentTab.url || "").origin;
    chrome.storage.local.get([baseUrl]).then((res) => {
      if (!res) return;
      if (typeof res === "object" && Object.keys(res).length === 0) return;

      (inputRef.current! as HTMLInputElement).value = JSON.parse(res[baseUrl]);
    });
  });
};